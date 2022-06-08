// my-component.js
export default {
    data() {
      return {
          channels: []
        }
    },
    methods: {
        toggleStep(row, step) {
            // this.channels[row].steps[step].selected = 
            console.log(row, step);
        },
        addChannel() {
            this.channels.push({
                sample: 'sample.wav',
                steps: new Array(16).fill(false)
            });
        },
        getStep(row, step) {
            return this.channels[row].steps[step];
        },
        removeChannel(index) {
            this.channels = this.channels.filter((e, i)=> {
                return i != index;
            });
        },
        log(data) {
            console.log(data);
        }
    }
  }