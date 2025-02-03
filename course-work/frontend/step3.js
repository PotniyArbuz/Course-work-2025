// Создание третьего шага
export function createStep3 (steps, document, A, B) {
    const upp = steps[steps.length - 1];

    const newContainer = document.createElement('div'); // Создаем контейнер с новым шагом
    newContainer.className = 'tree-container'; // Добавляем класс

    const downArrow = createArrow(newContainer, upp); // Создаем стрелочку
    document.body.appendChild(downArrow); // Добавляем стрелку

    document.body.appendChild(newContainer);

    const treeData = buildTree(A);

    createAnim3(newContainer, treeData);

                
    steps.push(newContainer); // Добавляем шаг в массив

    // Запускаем анимацию через небольшой таймаут
    setTimeout(() => {
        newContainer.classList.add('visible');
    }, 10);
}



// Преобразуем шаги в древовидную структуру
function buildTree(step) {
    const node = {
      id: step.id,
      name: `Step ${step.id}`,
      depth: step.depth,
      input: step.input,
      twiddle_factors: step.twiddle_factors,
      output: step.output,
      children: []
    };

    if (step.even) {
      node.children.push(buildTree(step.even));
    }
    if (step.odd) {
      node.children.push(buildTree(step.odd));
    }

    return node;
  }


function createAnim3(newContainer, treeData) {


    /********************** КАРТА РОДИТЕЛЕЙ **********************/
    const parentMap = new Map();
    function buildParentMap(node, parent = null) {
      if (parent) {
        parentMap.set(node.id, parent);
      }
      if (node.children) {
        node.children.forEach(child => buildParentMap(child, node));
      }
    }
    buildParentMap(treeData);

    /********************** НАСТРОЙКИ ВИЗУАЛИЗАЦИИ **********************/
    const levelY = {
      parent: 30,
      current: 150,
      child: 300,
      grandchild: 450
    };
    const nodeWidth = 100;
    const nodeHeight = 40;
    const transitionDuration = 500; // мс
    const baseWidth = 600;
    const margin = 50;
    const availableWidth2 = 120;
    // Фиксированный offset: по x — +60, по y — -30 (рассчитано ранее)
    const fixedOffset = { offsetX: (newContainer.clientWidth - baseWidth) / 2, offsetY: -30 };

    const svgOverlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // Установка атрибутов размеров и viewBox
    svgOverlay.setAttribute('class', 'svg-overlay');

    newContainer.appendChild(svgOverlay);

    /********************** ВЫЧИСЛЕНИЕ ПОЛОЖЕНИЙ УЗЛОВ **********************/
    function computeViewNodes(currentNode) {
      const viewNodes = [];
      
      // Родитель
      const parent = parentMap.get(currentNode.id);
      if (parent) {
        viewNodes.push({
          id: parent.id,
          role: 'parent',
          left: baseWidth / 2 - nodeWidth / 2,
          top: levelY.parent,
          node: parent
        });
      }
      
      // Текущий узел
      viewNodes.push({
        id: currentNode.id,
        role: 'current',
        left: baseWidth / 2 - nodeWidth / 2,
        top: levelY.current,
        node: currentNode
      });
      
      // Дети
      const children = currentNode.children || [];
      const numChildren = children.length;
      const availableWidth = baseWidth - 2 * margin;
      const stepX = numChildren > 1 ? availableWidth / (numChildren - 1) : 0;
      const childPositions = [];
      
      children.forEach((child, i) => {
        const x = margin + (stepX * i) - nodeWidth / 2;
        viewNodes.push({
          id: child.id,
          role: 'child',
          left: x,
          top: levelY.child,
          node: child
        });
        childPositions.push({ child, centerX: x + nodeWidth / 2 });
      });
      
      // Внуки
      childPositions.forEach(item => {
        if (item.child.children && item.child.children.length > 0) {
          const grandChildren = item.child.children;
          const numGrand = grandChildren.length;
          const stepX2 = numGrand > 1 ? availableWidth2 / (numGrand - 1) : 0;
          const startX = item.centerX - availableWidth2 / 2;
          grandChildren.forEach((grandchild, j) => {
            const grandX = startX + stepX2 * j - nodeWidth / 2;
            viewNodes.push({
              id: grandchild.id,
              role: 'grandchild',
              left: grandX,
              top: levelY.grandchild,
              node: grandchild
            });
          });
        }
      });
      
      return viewNodes;
    }

    /********************** РЕНДЕР УЗЛОВ **********************/
    const renderedNodes = new Map();

    function updateNodes(newViewNodes, offset) {
      const newIds = new Set(newViewNodes.map(item => item.id));
      
      newViewNodes.forEach(item => {
        let elem;
        if (renderedNodes.has(item.id)) {
          elem = renderedNodes.get(item.id).element;
          elem.className = 'node ' + item.role;
          if (item.node.children && item.node.children.length > 0) {
            elem.classList.add('has-children');
          } else {
            elem.classList.remove('has-children');
          }
        } else {
          elem = document.createElement('div');
          elem.className = 'node ' + item.role;
          elem.textContent = item.node.name;
          elem.dataset.nodeId = item.id;
          if (item.node.children && item.node.children.length > 0) {
            elem.classList.add('has-children');
          }
          elem.addEventListener('click', (e) => {
            e.stopPropagation();
            transitionTo(item.node);
          });
          newContainer.appendChild(elem);
          renderedNodes.set(item.id, { element: elem, role: item.role });
        }
        elem.textContent = item.node.name;
        elem.style.left = `${item.left + offset.offsetX}px`;
        elem.style.top = `${item.top + offset.offsetY}px`;
        elem.style.opacity = 1;
      });
      
      renderedNodes.forEach((data, id) => {
        if (!newIds.has(id)) {
          const elem = data.element;
          elem.style.opacity = 0;
          setTimeout(() => {
            if (elem.parentElement) {
              newContainer.removeChild(elem);
            }
            renderedNodes.delete(id);
          }, transitionDuration);
        }
      });
    }

    /********************** РИСОВАНИЕ ЛИНИЙ С ПЛАВНОЙ АНИМАЦИЕЙ **********************/
    function redrawLines(viewNodes, offset) {
      // Создаем новую группу для линий
      const newGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      // Применяем transition для плавного появления
      newGroup.style.opacity = "0";
      newGroup.style.transition = `opacity ${transitionDuration}ms ease`;
      
      // Рисуем линии внутри новой группы
      const parentItem = viewNodes.find(item => item.role === 'parent');
      const currentItem = viewNodes.find(item => item.role === 'current');
      
      if (parentItem && currentItem) {
        const parentCenterX = parentItem.left + nodeWidth/2 + offset.offsetX;
        const parentBottomY = levelY.parent + nodeHeight + offset.offsetY;
        const currentCenterX = currentItem.left + nodeWidth/2 + offset.offsetX;
        drawLine(parentCenterX, parentBottomY, currentCenterX, levelY.current + offset.offsetY, newGroup);
      }
      
      const childItems = viewNodes.filter(item => item.role === 'child');
      childItems.forEach(child => {
        const currentCenterX = currentItem.left + nodeWidth/2 + offset.offsetX;
        const childCenterX = child.left + nodeWidth/2 + offset.offsetX;
        drawLine(currentCenterX, levelY.current + nodeHeight + offset.offsetY, childCenterX, levelY.child + offset.offsetY, newGroup);
      });
      
      childItems.forEach(child => {
        const relatedGrand = viewNodes.filter(item => item.role === 'grandchild' &&
          Math.abs((child.left + nodeWidth/2) - (item.left + nodeWidth/2)) < 100);
        relatedGrand.forEach(grand => {
          drawLine(child.left + nodeWidth/2 + offset.offsetX, levelY.child + nodeHeight + offset.offsetY, grand.left + nodeWidth/2 + offset.offsetX, levelY.grandchild + offset.offsetY, newGroup);
        });
      });
      
      // Добавляем новую группу в SVG
      svgOverlay.appendChild(newGroup);
      // Принудительный reflow, затем запускаем анимацию появления
      newGroup.getBoundingClientRect();
      newGroup.style.opacity = "1";
      
      // Находим предыдущие группы (если они есть) и анимируем их исчезновение
      const oldGroups = svgOverlay.querySelectorAll("g.edges");
      oldGroups.forEach(oldGroup => {
        oldGroup.style.opacity = "0";
        setTimeout(() => {
          if (oldGroup.parentNode) {
            oldGroup.parentNode.removeChild(oldGroup);
          }
        }, transitionDuration);
      });
      // Отмечаем новую группу как текущую, добавляя ей класс
      newGroup.classList.add("edges");
    }

    function drawLine(x1, y1, x2, y2, group) {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2);
      line.setAttribute("stroke", "#000000");
      line.setAttribute("stroke-width", "2");
      line.setAttribute("stroke-linecap", "round");
      group.appendChild(line);
    }

    /********************** ОБНОВЛЕНИЕ ВИДА **********************/
    function updateView(newCurrentNode) {
      const viewNodes = computeViewNodes(newCurrentNode);
      const offset = fixedOffset;
      updateNodes(viewNodes, offset);
      setTimeout(() => {
        redrawLines(viewNodes, offset);
      }, transitionDuration * 0.5);
    }

    /********************** ПЛАВНЫЙ ПЕРЕХОД **********************/
    function transitionTo(newCurrentNode) {
      updateView(newCurrentNode);
    }

    /********************** ИНИЦИАЛИЗАЦИЯ **********************/
    let currentNode = treeData;
    updateView(currentNode);
}



function createArrow(newContainer, upp) {
    const downArrow = document.createElement('div');
    downArrow.className = 'arrow-4';
    const q1 = document.createElement('span');
    q1.className = 'arrow-4-left';
    const q2 = document.createElement('span');
    q2.className = 'arrow-4-right';
    downArrow.appendChild(q1);
    downArrow.appendChild(q2);
    downArrow.addEventListener('click', () => {
        downArrow.classList.toggle('open');
        if (downArrow.classList.contains('open')) {
            // Если стрелка вниз — скролл вниз
            newContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // Если стрелка вверх — скролл вверх
            upp.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
    return downArrow;
}
