// my-component.js
export default {
    data() {
      return {
          count: 0,
          channels: []
        }
    },
    methods: {
        toggleStep(row, step) {
            console.log(row, step);
        },
        addChannel() {
            this.channels.push({
                sample: 'sample.wav',
                steps: new Array(16).fill({
                    selected: false
                })
            });
        },
        getStep(row, step) {
            return this.channels[row].steps[step];
        },
        removeChannel(index) {
            this.channels = this.channels.filter((e, i)=> {
                return i != index;
            });
        }
    }
  }