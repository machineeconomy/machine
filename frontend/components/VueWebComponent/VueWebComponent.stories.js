
import { storiesOf } from '@storybook/vue'
import VueWebComponent from './VueWebComponent'

storiesOf('VueWebComponent', module)
  .add('normal', () => ({
    components: { VueWebComponent },
    template:
      `
      <VueWebComponent msg="Hello World from Storybook!" />
    `
  }))