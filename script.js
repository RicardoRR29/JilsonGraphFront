const api = axios.create({
  baseURL: "https://jilsongraph.herokuapp.com/",
});
new Vue({
  el: "#app",
  data: {
    openModalNode: false,
    openModalRelation: false,
    openModalEdge: false,

    // Nó
    nodeName: "",
    nodeProperties: [
      {
        fieldName: "",
        fieldValue: "",
      },
    ],

    // Aresta
    relationName: "",
    firstNodeName: "",
    secondNodeName: "",
    directed: false,

    edgeName: "",
    firstNodeId: "",
    secondNodeId: "",
    edgeProperties: [
      {
        fieldName: "",
        fieldValue: "",
      },
    ],
    graphData: [],
    graphLabels: [],
    dataReady: false,
  },
  // Gráfico
  methods: {
    async createEdge(nome) {
      await api.post("/doc", {
        name: nome,
        type: "edge",
      });
    },
    async createNode(nome) {
      await api.post("/doc", {
        name: nome,
        type: "node",
      });
    },
    async postObjInNode({ nodeName, properties }) {
      await api.post("/node", {
        nodeName: nodeName,
        properties: properties,
      });
    },

    async postEdge({ relationName, firstNodeName, secondNodeName }) {
      await api.post(`/edge/`, {
        firstNodeName,
        secondNodeName,
        directed: true,
      });
    },
    getNodeInfos(nodeName) {
      api.get(`/node/all/${nodeName}`);
    },

    addNodeProperty() {
      this.nodeProperties.push({
        fieldName: "",
        fieldValue: "",
      });
    },

    removeNodeProperty() {
      if (this.nodeProperties.length - 1 > 0) {
        this.nodeProperties.splice(this.nodeProperties.length - 1, 1);
      }
    },

    async handleAddNode(nodeName) {
      let data = {};
      for (const property of this.nodeProperties) {
        data[property.fieldName] = property.fieldValue;
      }

      await this.postObjInNode({ nodeName: nodeName, properties: data });
    },

    async getAllNodes() {
      const response = await api.get("node").then((response) => response);
      return response.data.content;
    },

    async sendNode() {
      const nodes = await this.getAllNodes();
      if (nodes.indexOf(`${this.nodeName}.json`) > -1) {
        await this.handleAddNode(this.nodeName);
        return;
      }
      await this.createNode(this.nodeName);
      await this.handleAddNode(this.nodeName);
    },

    addEdgeProperty() {
      this.edgeProperties.push({
        fieldName: "",
        fieldValue: "",
      });
    },

    removeEdgeProperty() {
      if (this.edgeProperties.length - 1 > 0) {
        this.edgeProperties.splice(this.edgeProperties.length - 1, 1);
      }
    },
    async getAllEdge() {
      const response = await api.get("edge");

      return response.data.content;
    },

    async sendRelation() {
      const edges = await this.getAllEdge();

      if (edges.indexOf(`${this.relationName}.json`) > -1) {
        await this.postEdge({
          relationName: this.relationName,
          firstNodeName: this.firstNodeName,
          secondNodeName: this.secondNodeName,
        });
        return;
      }

      await this.createEdge(this.relationName);
      await this.postEdge({
        relationName: this.relationName,
        firstNodeName: this.firstNodeName,
        secondNodeName: this.secondNodeName,
      });
    },

    async sendEdge() {
      let data = {};
      for (const property of this.edgeProperties) {
        data[property.fieldName] = property.fieldValue;
      }

      await api.post(`/edge/${this.edgeName}`, {
        firstNodeId: this.firstNodeId,
        secondNodeId: this.secondNodeId,
        edgeInfos: data,
      });
    },

    async populateGraph() {
      const response = await api.get(`/edge/teste`);

      let xAxis = 200;
      let yAxis = 100;
      let control = 1;
      for (const data of response.data.content.data) {
        const names = this.graphData.map((item) => item.name);
        if (names.indexOf(data.firstNodeId) < 0) {
          if (control % 2 > 0) {
            this.graphData.push({
              name: data.firstNodeId,
              x: xAxis,
              y: yAxis,
            });
          } else {
            this.graphData.push({
              name: data.firstNodeId,
              x: -xAxis,
              y: yAxis,
            });
          }
        }

        control++;
        yAxis *= 1.5;
      }

      for (const data of response.data.content.data) {
        const names = this.graphData.map((item) => item.name);
        if (names.indexOf(data.secondNodeId) < 0) {
          if (control % 2 > 0) {
            this.graphData.push({
              name: data.secondNodeId,
              x: xAxis,
              y: yAxis,
            });
          } else {
            this.graphData.push({
              name: data.secondNodeId,
              x: -xAxis,
              y: yAxis,
            });
          }
        }

        control++;
        yAxis *= 1.5;
      }

      for (const data of response.data.content.data) {
        this.graphLabels.push({
          source: data.firstNodeId,
          target: data.secondNodeId,
          // value: "teste",
          label: {
            show: false,
            // formatter: (obj) => {
            //   return obj.data.value;
            // },
          },
          data: [
            {
              name: "Node 1",
              x: 100,
              y: 100,
            },
            {
              name: "Node 2",
              x: 100,
              y: 150,
            },
            {
              name: "Node 3",
              x: 150,
              y: 150,
            },
            {
              name: "Node 4",
              x: 150,
              y: 100,
            },
          ],
          // links: [],
          links: [
            {
              source: "Node 3",
              target: "Node 1",
              value: "teste",
              label: {
                show: true,
                formatter: (obj) => {
                  return obj.data.value;
                },
              },
              lineStyle: {
                width: 2,
                curveness: 0.2,
              },
            },
            {
              source: "Node 2",
              target: "Node 1",
              label: {
                formatter: "{b}",
              },
              lineStyle: {
                curveness: 0.2,
              },
            },
            {
              source: "Node 1",
              target: "Node 3",
            },
            {
              source: "Node 2",
              target: "Node 3",
            },
            {
              source: "Node 2",
              target: "Node 4",
            },
            {
              source: "Node 1",
              target: "Node 4",
            },
            {
              source: "Node 1",
              target: "Node 3",
              value: "aaaa",
            },
          ],
          lineStyle: {
            width: 2,
            curveness: 0.2,
          },
        });
      }
    },
  },

  async mounted() {
    await this.populateGraph();
    this.dataReady = true;
    if (this.dataReady) {
      console.log(this.graphLabels);
      var chartDom = document.getElementById("main");
      var myChart = echarts.init(chartDom, "dark");
      var option;
      option = {
        title: {
          text: "Basic Graph",
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: "quinticInOut",
        series: [
          {
            type: "graph",
            layout: "none",
            symbolSize: 50,
            roam: true,
            label: {
              show: true,
            },
            edgeSymbol: ["circle", "arrow"],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
              fontSize: 20,
            },
            data: this.graphData.map((item) => ({
              name: item.name,
              x: item.x,
              y: item.y,
            })),
            links: this.graphLabels.map((item) => ({
              source: item.source,
              target: item.target,
              label: item.label,
              lineStyle: item.lineStyle,
            })),

            lineStyle: {
              opacity: 0.9,
              width: 2,
              curveness: 0,
            },
          },
        ],
      };

      option && myChart.setOption(option);
    }
  },
});
