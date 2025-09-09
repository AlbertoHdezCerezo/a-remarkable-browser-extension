import type { Preview } from '@storybook/react-webpack5'

import '../assets/css/style.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
}

export default preview