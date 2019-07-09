
import { storiesOf } from '@storybook/vue'
import StatusBadge from './StatusBadge'

storiesOf('StatusBadge', module)
    .add('normal', () => ({
        components: { StatusBadge },
        template:
        `
            <StatusBadge url="localhost:3001"/>
        `
    }))