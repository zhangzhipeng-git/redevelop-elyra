class Topology {
  list: any;
  queue: any;
  indegree: any;
  constructor() {
    this.list = [];
    this.queue = [];
    this.indegree = {};
  }

  // 是否有环
  isLoop(edges: any) {
    const nodeLen = this._init(edges);
    Object.keys(this.indegree).forEach(id => {
      if (this.indegree[id] === 0) {
        this.queue.push(id);
      }
    });

    let count = 0;
    while (this.queue.length) {
      ++count;
      const currentNode = this.queue.pop();
      const nodeTargets = this.list[currentNode];
      for (let i = 0; i < nodeTargets.length; i++) {
        const target = nodeTargets[i];
        this.indegree[target] -= 1;
        if (this.indegree[target] === 0) {
          this.queue.push(target);
        }
      }
    }

    return count < nodeLen;
  }

  _init(edges: any) {
    let nodes: any = [];
    edges.forEach((item: any) => {
      const { source, target } = item;
      nodes.push(source);
      nodes.push(target);
      this._addEdge(source, target);
    });
    nodes = [...new Set(nodes)];
    nodes.forEach((node: any) => {
      if (!this.indegree[node]) this.indegree[node] = 0;
      if (!this.list[node]) this.list[node] = [];
    });

    return nodes.length;
  }

  _addEdge(source: string, target: string) {
    if (!this.list[source]) this.list[source] = [];
    if (!this.indegree[target]) this.indegree[target] = 0;
    this.list[source].push(target);
    this.indegree[target] += 1;
  }
}

export default Topology;
