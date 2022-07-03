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
  },
  methods: {
    createEdge(nome) {
      api.post("/doc", {
        name: nome,
        type: "edge",
      });
    },
    createNode(nome) {
      api.post("/doc", {
        name: nome,
        type: "node",
      });
    },
    postObjInNode({ nodeName, properties }) {
      api.post("/node", {
        nodeName,
        properties: properties,
      });
    },

    postEdge({ relationName, firstNodeName, secondNodeName }) {
      api.post(`/edge/${relationName}`, {
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

    sendNode() {
      console.log(this.nodeName);
      this.createNode(this.nodeName);
      for (const property of this.nodeProperties) {
        console.log(property);
      }
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
    getAllEdge() {
      api.get("edge").then((response) => {
        console.log(response);
      });
    },
    sendRelation() {
      postEdge({
        relationName: this.relationName,
        firstNodeName: this.firstNodeName,
        secondNodeName: this.secondNodeName,
      });
    },
  },

  mounted() {
    this.getAllEdge();
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
          data: [
            {
              name: "Node 1",
              x: 300,
              y: 300,
            },
            {
              name: "Node 2",
              x: 800,
              y: 300,
            },
            {
              name: "Node 3",
              x: 550,
              y: 100,
            },
            {
              name: "Node 4",
              x: 550,
              y: 500,
            },
          ],
          // links: [],
          links: [
            {
              source: 2,
              target: 1,
              value: "teste",
              label: {
                show: true,
                formatter: (obj) => {
                  return obj.data.value;
                },
              },
              lineStyle: {
                width: 5,
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
            opacity: 0.9,
            width: 2,
            curveness: 0,
          },
        },
      ],
    };

    option && myChart.setOption(option);
  },
});
