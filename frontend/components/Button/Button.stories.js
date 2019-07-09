
import { storiesOf } from '@storybook/vue'
import Button from './Button'

storiesOf('Button', module)
  .add('normal', () => ({
    components: { Button },
    template:
      `
      <Button msg="Hello World from Storybook!" />
    `
  }))