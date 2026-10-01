class GraphSimulation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];       // Array of { id, x, y, vx, vy, label, isAccept }
        this.links = [];       // Array of { source, target, label }
        this.repulsionK = 400; // Repulsion constant
        this.springK = 0.04;   // Spring stiffness
        this.damping = 0.85;   // Velocity damping coefficient
    }

    initFromNFA(nfa) {
        this.nodes = [];
        this.links = [];
        let visited = new Set();

        // Traverse the parsed object tree to extract flat nodes and edges
        const traverse = (state) => {
            if (visited.has(state.id)) return;
            visited.add(state.id);

            this.nodes.push({
                id: state.id,
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: 0,
                vy: 0,
                label: `q${state.id}`,
                isAccept: state.isAccept
            });

            for (let symbol in state.transitions) {
                for (let target of state.transitions[symbol]) {
                    this.links.push({ source: state.id, target: target.id, label: symbol });
                    traverse(target);
                }
            }
        };

        traverse(nfa.startState);
    }

    // Calculate physical force changes on every loop tick frame
    updatePhysics() {
        // 1. Apply Node Repulsion Forces (All pairs push away)
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                let n1 = this.nodes[i];
                let n2 = this.nodes[j];
                let dx = n2.x - n1.x;
                let dy = n2.y - n1.y;
                let dist = Math.sqrt(dx * dx + dy * dy) || 1;

                let force = this.repulsionK / (dist * dist);
                let fx = (dx / dist) * force;
                let fy = (dy / dist) * force;

                n1.vx -= fx; n1.vy -= fy;
                n2.vx += fx; n2.vy += fy;
            }
        }

        // 2. Apply Spring Attraction Forces (Connected pairs pull together)
        for (let link of this.links) {
            let n1 = this.nodes.find(n => n.id === link.source);
            let n2 = this.nodes.find(n => n.id === link.target);
            if (!n1 || !n2) continue;

            let dx = n2.x - n1.x;
            let dy = n2.y - n1.y;
            let dist = Math.sqrt(dx * dx + dy * dy) || 1;

            let restLength = 80;
            let force = this.springK * (dist - restLength);
            let fx = (dx / dist) * force;
            let fy = (dy / dist) * force;

            n1.vx += fx; n1.vy += fy;
            n2.vx -= fx; n2.vy -= fy;
        }

        // 3. Update Velocities and Positions with Viewport Constraints
        for (let node of this.nodes) {
            node.vx *= this.damping;
            node.vy *= this.damping;
            node.x += node.vx;
            node.y += node.vy;

            // Keep inside bounds
            node.x = Math.max(20, Math.min(this.canvas.width - 20, node.x));
            node.y = Math.max(20, Math.min(this.canvas.height - 20, node.y));
        }
    }

    // Draw nodes, springs, and transaction indicators onto Canvas
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw lines (links)
        this.links.forEach(link => {
            let n1 = this.nodes.find(n => n.id === link.source);
            let n2 = this.nodes.find(n => n.id === link.target);
            if (!n1 || !n2) return;

            this.ctx.beginPath();
            this.ctx.moveTo(n1.x, n1.y);
            this.ctx.lineTo(n2.x, n2.y);
            this.ctx.strokeStyle = '#475569';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Render the character labels right in the middle of transition vectors
            this.ctx.fillStyle = '#00ffaa';
            this.ctx.font = '12px monospace';
            this.ctx.fillText(link.label, (n1.x + n2.x) / 2, (n1.y + n2.y) / 2 - 5);
        });

        // Draw circles (nodes)
        this.nodes.forEach(node => {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, 16, 0, 2 * Math.PI);
            this.ctx.fillStyle = '#1e293b';
            this.ctx.fill();
            this.ctx.strokeStyle = node.isAccept ? '#ff0055' : '#00ffaa'; // Accept nodes get red rings
            this.ctx.lineWidth = node.isAccept ? 4 : 2;
            this.ctx.stroke();

            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '10px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(node.label, node.x, node.y);
        });
    }

    startLoop() {
        const loop = () => {
            this.updatePhysics();
            this.render();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
}