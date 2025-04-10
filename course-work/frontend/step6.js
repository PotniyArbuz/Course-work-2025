import { createArrow } from './utils.js';

export function createStep6(steps, document, c_steps, finalRounded) {
    const container = document.createElement('div');
    container.className = 'step3-container';
    container.style.display = 'flex';
    container.style.gap = '20px';

    const treeContainer = document.createElement('div');
    treeContainer.className = 'tree-container';
    treeContainer.style.flex = '1';
    container.appendChild(treeContainer);

    const explanationPanel = document.createElement('div');
    explanationPanel.className = 'explanation-panel';
    explanationPanel.style.flex = '1';
    explanationPanel.style.padding = '20px';
    explanationPanel.style.background = '#c5c9d3';
    explanationPanel.style.borderRadius = '8px';
    explanationPanel.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.15)';
    explanationPanel.innerHTML = `
        <h3>Inverse Fast Fourier Transform (IFFT)</h3>
        <h3>Information about the vertex (click on the vertex to learn more about it)</h3>
        <div id="node-explanation"></div>
    `;
    container.appendChild(explanationPanel);

    const downArrow = createArrow(treeContainer, steps[steps.length - 1]);
    document.body.appendChild(downArrow);

    document.body.appendChild(container);

    const treeData = buildTree(c_steps);
    createAnim6(treeContainer, treeData, explanationPanel, finalRounded);

    steps.push(container);

    setTimeout(() => {
        container.classList.add('visible');
    }, 10);
}

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

function createAnim6(newContainer, treeData, explanationPanel, finalRounded) {
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

    const levelY = {
        parent: 30,
        current: 150,
        child: 300,
        grandchild: 450
    };
    const nodeWidth = 100;
    const nodeHeight = 40;
    const transitionDuration = 500;
    const baseWidth = 600;
    const margin = 50;
    const availableWidth2 = 120;
    const fixedOffset = { offsetX: (newContainer.clientWidth - baseWidth) / 2, offsetY: -30 };

    const svgOverlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgOverlay.setAttribute('class', 'svg-overlay');
    newContainer.appendChild(svgOverlay);

    function computeViewNodes(currentNode) {
        const viewNodes = [];

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

        viewNodes.push({
            id: currentNode.id,
            role: 'current',
            left: baseWidth / 2 - nodeWidth / 2,
            top: levelY.current,
            node: currentNode
        });

        const children = currentNode.children || [];
        const numChildren = children.length;
        if (numChildren > 0) {
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
        }

        return viewNodes;
    }

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
                elem.innerHTML = `<strong>${item.node.name}</strong>`;
                elem.dataset.nodeId = item.id;
                if (item.node.children && item.node.children.length > 0) {
                    elem.classList.add('has-children');
                }
                newContainer.appendChild(elem);
                renderedNodes.set(item.id, { element: elem, role: item.role });
            }
            elem.onclick = (e) => {
                e.stopPropagation();
                updateExplanationPanel(explanationPanel, item.node, finalRounded);
                transitionTo(item.node);
            };
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

    function redrawLines(viewNodes, offset) {
        const newGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        newGroup.style.opacity = "0";
        newGroup.style.transition = `opacity ${transitionDuration}ms ease`;

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
            const grandChildren = viewNodes.filter(item => item.role === 'grandchild' && parentMap.get(item.id) === child.node);
            grandChildren.forEach(grand => {
                drawLine(
                    child.left + nodeWidth/2 + offset.offsetX,
                    levelY.child + nodeHeight + offset.offsetY,
                    grand.left + nodeWidth/2 + offset.offsetX,
                    levelY.grandchild + offset.offsetY,
                    newGroup
                );
            });
        });

        svgOverlay.appendChild(newGroup);
        newGroup.getBoundingClientRect();
        newGroup.style.opacity = "1";

        const oldGroups = svgOverlay.querySelectorAll("g.edges");
        oldGroups.forEach(oldGroup => {
            oldGroup.style.opacity = "0";
            setTimeout(() => {
                if (oldGroup.parentNode) {
                    oldGroup.parentNode.removeChild(oldGroup);
                }
            }, transitionDuration);
        });
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

    function updateView(newCurrentNode) {
        const viewNodes = computeViewNodes(newCurrentNode);
        const offset = fixedOffset;
        updateNodes(viewNodes, offset);
        setTimeout(() => {
            redrawLines(viewNodes, offset);
        }, transitionDuration * 0.5);
    }

    function transitionTo(newCurrentNode) {
        updateView(newCurrentNode);
    }

    let currentNode = treeData;
    updateView(currentNode);
    updateExplanationPanel(explanationPanel, currentNode, finalRounded);
}

function formatComplexNumber(c) {
    if (typeof c === 'number') {
        return c.toFixed(3);
    }
    if (typeof c !== 'object' || c === null) {
        return String(c);
    }
    const real = c.real.toFixed(3);
    const imag = c.imag.toFixed(3);
    if (imag === "0.000") return real;
    if (real === "0.000") return `${imag}i`;
    return `${real} ${imag >= 0 ? '+' : '-'} ${Math.abs(imag)}i`;
}

function updateExplanationPanel(panel, node, finalRounded) {
    const inputFormatted = node.input.map(item => 
        formatComplexNumber(item)
    ).join(', ');

    const twiddleFormatted = node.twiddle_factors.length > 0 
        ? node.twiddle_factors.map(t => formatComplexNumber(t)).join(', ')
        : 'Absent (leaf vertex)';

    const outputFormatted = node.output.map(o => 
        formatComplexNumber(o)
    ).join(', ');

    let evenFormatted = 'No data (leaf node)';
    let oddFormatted = 'No data (leaf node)';
    let evenSource = '';
    let oddSource = '';
    if (node.children && node.children.length > 0) {
        const evenNode = node.children[0];
        const oddNode = node.children[1] || null;
        evenFormatted = evenNode.output.map(o => formatComplexNumber(o)).join(', ');
        evenSource = `Step ${evenNode.id}`;
        if (oddNode) {
            oddFormatted = oddNode.output.map(o => formatComplexNumber(o)).join(', ');
            oddSource = `Step ${oddNode.id}`;
        } else {
            oddFormatted = 'No data';
            oddSource = 'No data';
        }
    }

    let finalOutputHTML = '';
    if (node.depth === 0 && finalRounded) {
        const reversedFinalRounded = [...finalRounded].reverse();
        const finalRoundedFormatted = reversedFinalRounded.join(', ');
        finalOutputHTML = `<p><strong>Final Reversed Array:</strong> \\([${finalRoundedFormatted}]\\)</p>`;
    }

    panel.querySelector('#node-explanation').innerHTML = `
        <p><strong>ID:</strong> \\(${node.id}\\)</p>
        <p><strong>Depth:</strong> \\(${node.depth}\\)</p>
        <p><strong>Input Data:</strong> \\([${inputFormatted}]\\)</p>
        
        <div class="explanation-section">
            <h4>Twiddle Factors (IFFT)</h4>
            <p>Twiddle factors for the inverse FFT are calculated using the formula:</p>
            <p class="math-formula">$$ W_n^{-k} = e^{2\\pi i k / n},\\quad where$$</p>
            <ul>
                <li>\\(n\\) \\(-\\) the length of the input array at this step.</li>
                <li>\\(k\\) \\(-\\) the index from \\(0\\) to \\(n/2 - 1\\).</li>
            </ul>
            <p><strong>Values:</strong> \\([${twiddleFormatted}]\\)</p>
        </div>
        
        <div class="explanation-section">
            <h4>Output Data (IFFT)</h4>
            <p>The output data is computed as a combination of the IFFT results for the even and odd elements from the child nodes, normalized by \\(1/n\\):</p>
            <ul>
                <li>For \\(k < n/2 : output[k] = (even[k] + W_n^{-k} \\cdot odd[k]) / n\\)</li>
                <li>For \\(k \\geq n/2: output[k] = (even[k - n/2] - W_n^{-k} \\cdot odd[k - n/2]) / n\\)</li>
            </ul>
            <p><strong>Even Array:</strong> Output data from the even branch (from node ${evenSource}): \\([${evenFormatted}]\\)</p>
            <p><strong>Odd Array:</strong> Output data from the odd branch (from node ${oddSource}): \\([${oddFormatted}]\\)</p>
            <p><strong>Result:</strong> \\([${outputFormatted}]\\)</p>
            ${finalOutputHTML}
        </div>
    `;


    MathJax.typeset();
}