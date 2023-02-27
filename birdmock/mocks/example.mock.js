module.exports = {
  '/example': params => {
    if (params.id === 1) {
      return {
        status: 200,
        data: {
          content: '我是示例mock返回的数据1'
        }
      };
    } else {
      return {
        status: 400,
        data: {
          content: '我是示例mock返回的数据2'
        }
      };
    }
  },
  '/elyra/schemaspace': () => {
    return {
      schemaspaces: [
        'code-snippets',
        'component-catalogs',
        'runtimes',
        'runtime-images'
      ]
    };
  },
  '/elyra/schema/code-snippets': () => {
    return {
      'code-snippets': [
        {
          $schema:
            'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/meta-schema.json',
          $id: 'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/code-snippet.json',
          title: 'Code Snippet',
          name: 'code-snippet',
          schemaspace: 'code-snippets',
          schemaspace_id: 'aa60988f-8f7c-4d09-a243-c54ef9c2f7fb',
          uihints: {
            title: 'Code Snippets',
            icon: 'elyra:code-snippet',
            reference_url:
              'https://elyra.readthedocs.io/en/v3.14.2/user_guide/code-snippets.html'
          },
          properties: {
            schema_name: {
              title: 'Schema Name',
              description: 'The schema associated with this instance',
              type: 'string',
              const: 'code-snippet'
            },
            display_name: {
              title: 'Display Name',
              description: 'The display name of the Code Snippet',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: 'Additional data specific to this Code Snippet',
              type: 'object',
              properties: {
                description: {
                  title: 'Description',
                  description: 'Code snippet description',
                  type: 'string'
                },
                tags: {
                  title: 'Tags',
                  description: 'Tags for categorizing snippets',
                  type: 'array',
                  uniqueItems: true,
                  items: { minLength: 1, pattern: '^[^ \t]+([ \t]+[^ \t]+)*$' },
                  uihints: { 'ui:field': 'tags' }
                },
                language: {
                  title: 'Language',
                  description: 'Code snippet implementation language',
                  type: 'string',
                  uihints: {
                    'ui:field': 'dropdown',
                    default_choices: [
                      'Python',
                      'Java',
                      'R',
                      'Scala',
                      'Markdown'
                    ],
                    category: 'Source'
                  },
                  minLength: 1
                },
                code: {
                  title: 'Code',
                  description: 'Code snippet code lines',
                  type: 'array',
                  items: { type: 'string' },
                  uihints: { 'ui:field': 'code', category: 'Source' }
                }
              },
              required: ['language', 'code']
            }
          },
          required: ['schema_name', 'display_name', 'metadata']
        }
      ]
    };
  },
  '/static/elyra/airflow.svg': () => {
    return `<svg viewBox="0 0 175 270" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
        <path d="M4.18587 172.44L86.3959 88.1685C86.9109 87.6406 87.0096 86.8244 86.5801 86.2249C81.5792 79.2442 72.3564 78.0343 68.9375 73.3445C58.8101 59.4522 56.2405 51.5891 51.8887 52.0768C51.5847 52.1109 51.3137 52.2745 51.1001 52.4934L21.4015 82.9367C4.31645 100.45 1.86636 139.01 1.41703 171.298C1.39673 172.757 3.1669 173.484 4.18587 172.44Z" fill="#017CEE"/>
        <path d="M172.44 170.357L88.1685 88.1466C87.6406 87.6316 86.8244 87.5328 86.2249 87.9623C79.2443 92.9633 78.0344 102.186 73.3445 105.605C59.4522 115.732 51.5891 118.302 52.0768 122.654C52.1109 122.958 52.2745 123.229 52.4935 123.442L82.9367 153.141C100.45 170.226 139.01 172.676 171.298 173.125C172.757 173.146 173.484 171.376 172.44 170.357Z" fill="#00AD46"/>
        <path fill-rule="evenodd" d="M82.9363 153.141C73.3696 143.809 68.9312 125.346 87.2715 87.2725C57.4647 100.593 47.0194 118.103 52.1578 123.116L82.9363 153.141Z" fill="#04D659"/>
        <path d="M170.355 2.10462L88.1451 86.376C87.6301 86.9039 87.5314 87.72 87.9609 88.3195C92.9618 95.3002 102.185 96.5101 105.603 101.2C115.731 115.092 118.301 122.955 122.652 122.468C122.956 122.434 123.227 122.27 123.441 122.051L153.139 91.6077C170.225 74.0942 172.675 35.5346 173.124 3.24627C173.144 1.78719 171.374 1.0601 170.355 2.10462Z" fill="#00C7D4"/>
        <path fill-rule="evenodd" d="M153.14 91.6077C143.807 101.174 125.344 105.613 87.2705 87.2725C100.591 117.079 118.101 127.525 123.114 122.386L153.14 91.6077Z" fill="#11E1EE"/>
        <path d="M2.10315 4.18733L86.3745 86.3973C86.9024 86.9123 87.7185 87.0111 88.3181 86.5816C95.2987 81.5807 96.5086 72.3579 101.198 68.939C115.091 58.8116 122.954 56.242 122.466 51.8902C122.432 51.5862 122.268 51.3152 122.05 51.1016L91.6063 21.403C74.0928 4.31792 35.5331 1.86783 3.2448 1.4185C1.78572 1.39819 1.05863 3.16836 2.10315 4.18733Z" fill="#E43921"/>
        <path fill-rule="evenodd" d="M91.6057 21.4025C101.172 30.7352 105.611 49.1977 87.2705 87.2714C117.077 73.9511 127.523 56.4408 122.384 51.4281L91.6057 21.4025Z" fill="#FF7557"/>
        <path fill-rule="evenodd" d="M21.4025 82.9368C30.7352 73.3701 49.1977 68.9317 87.2714 87.272C73.951 57.4652 56.4408 47.0199 51.4281 52.1583L21.4025 82.9368Z" fill="#0CB6FF"/>
        <circle cx="87.2838" cy="87.2606" r="3.67606" transform="rotate(-0.709386 87.2838 87.2606)" fill="#4A4848"/>
        <path d="M19.1525 224.647C18.9422 224.647 18.7581 224.568 18.6004 224.41C18.4426 224.253 18.3638 224.069 18.3638 223.858C18.3638 223.648 18.3769 223.503 18.4032 223.424L28.1835 197.909C28.3938 197.331 28.8145 197.041 29.4455 197.041H32.1271C32.7581 197.041 33.1788 197.331 33.3891 197.909L43.13 223.424L43.2088 223.858C43.2088 224.069 43.13 224.253 42.9722 224.41C42.8145 224.568 42.6304 224.647 42.4201 224.647H40.4088C40.1196 224.647 39.8962 224.581 39.7384 224.45C39.5807 224.292 39.4755 224.134 39.4229 223.977L37.2539 218.377H24.3187L22.1497 223.977C22.0971 224.134 21.9788 224.292 21.7948 224.45C21.637 224.581 21.4267 224.647 21.1638 224.647H19.1525ZM36.1102 214.985L30.7863 200.985L25.4624 214.985H36.1102ZM47.8593 232.14C47.5964 232.14 47.3729 232.048 47.1888 231.864C47.0311 231.706 46.9522 231.496 46.9522 231.233V205.047C46.9522 204.784 47.0311 204.574 47.1888 204.416C47.3729 204.232 47.5964 204.14 47.8593 204.14H49.6734C49.9363 204.14 50.1466 204.232 50.3043 204.416C50.4884 204.574 50.5804 204.784 50.5804 205.047V206.782C52.0527 204.758 54.2086 203.746 57.048 203.746C59.8086 203.746 61.8724 204.613 63.2396 206.348C64.633 208.084 65.3823 210.318 65.4874 213.053C65.5137 213.342 65.5269 213.789 65.5269 214.393C65.5269 214.998 65.5137 215.445 65.4874 215.734C65.3823 218.442 64.633 220.677 63.2396 222.439C61.8461 224.174 59.7823 225.041 57.048 225.041C54.3137 225.041 52.1842 224.055 50.6593 222.084V231.233C50.6593 231.496 50.5804 231.706 50.4227 231.864C50.2649 232.048 50.0546 232.14 49.7917 232.14H47.8593ZM56.2198 221.847C58.0865 221.847 59.4405 221.269 60.2818 220.112C61.1494 218.955 61.6227 217.43 61.7015 215.537C61.7278 215.274 61.741 214.893 61.741 214.393C61.741 209.424 59.9006 206.94 56.2198 206.94C54.4058 206.94 53.0386 207.545 52.1184 208.754C51.2245 209.937 50.7381 211.357 50.6593 213.013L50.6198 214.512L50.6593 216.05C50.7119 217.601 51.2114 218.955 52.1579 220.112C53.1043 221.269 54.4583 221.847 56.2198 221.847ZM76.1236 225.041C74.8354 225.041 73.6391 224.778 72.5349 224.253C71.4307 223.727 70.5499 223.017 69.8926 222.123C69.2616 221.203 68.9462 220.191 68.9462 219.086C68.9462 217.351 69.656 215.931 71.0757 214.827C72.5217 213.697 74.4673 212.961 76.9124 212.619L82.7884 211.791V210.647C82.7884 207.965 81.2504 206.624 78.1743 206.624C77.0175 206.624 76.071 206.874 75.3349 207.374C74.5987 207.847 74.0466 208.412 73.6785 209.07C73.5997 209.306 73.4945 209.477 73.3631 209.582C73.2579 209.687 73.1001 209.74 72.8898 209.74H71.194C70.9574 209.74 70.7471 209.661 70.5631 209.503C70.4053 209.319 70.3264 209.109 70.3264 208.872C70.3527 208.241 70.6419 207.531 71.194 206.743C71.7724 205.928 72.6532 205.231 73.8363 204.653C75.0194 204.048 76.4785 203.746 78.2138 203.746C81.1584 203.746 83.2748 204.442 84.5631 205.836C85.8513 207.203 86.4954 208.912 86.4954 210.962V223.74C86.4954 224.003 86.4034 224.226 86.2194 224.41C86.0616 224.568 85.8513 224.647 85.5884 224.647H83.7743C83.5114 224.647 83.2879 224.568 83.1039 224.41C82.9462 224.226 82.8673 224.003 82.8673 223.74V222.044C82.2889 222.885 81.4476 223.595 80.3433 224.174C79.2391 224.752 77.8325 225.041 76.1236 225.041ZM76.9518 222.084C78.6607 222.084 80.0541 221.531 81.1321 220.427C82.2363 219.297 82.7884 217.68 82.7884 215.577V214.472L78.2138 215.143C76.3471 215.406 74.9405 215.853 73.994 216.484C73.0476 217.088 72.5743 217.864 72.5743 218.81C72.5743 219.862 73.0081 220.677 73.8757 221.255C74.7433 221.808 75.7687 222.084 76.9518 222.084ZM100.446 225.041C97.6333 225.041 95.4249 224.253 93.8211 222.675C92.2436 221.071 91.4023 218.837 91.2972 215.971L91.2577 214.393L91.2972 212.816C91.4023 209.95 92.2436 207.729 93.8211 206.151C95.4249 204.547 97.6333 203.746 100.446 203.746C102.339 203.746 103.943 204.087 105.258 204.771C106.572 205.454 107.545 206.296 108.176 207.295C108.833 208.294 109.188 209.293 109.241 210.292C109.267 210.555 109.188 210.765 109.004 210.923C108.82 211.081 108.597 211.16 108.334 211.16H106.441C106.178 211.16 105.981 211.107 105.849 211.002C105.718 210.897 105.586 210.686 105.455 210.371C105.008 209.109 104.377 208.215 103.562 207.689C102.747 207.137 101.722 206.861 100.486 206.861C98.8558 206.861 97.5544 207.374 96.5817 208.399C95.6352 209.398 95.1225 210.936 95.0436 213.013L95.0042 214.433L95.0436 215.774C95.1225 217.877 95.6352 219.428 96.5817 220.427C97.5281 221.426 98.8296 221.926 100.486 221.926C101.722 221.926 102.747 221.663 103.562 221.137C104.377 220.585 105.008 219.678 105.455 218.416C105.586 218.1 105.718 217.89 105.849 217.785C105.981 217.654 106.178 217.588 106.441 217.588H108.334C108.597 217.588 108.82 217.68 109.004 217.864C109.188 218.022 109.267 218.232 109.241 218.495C109.188 219.468 108.833 220.467 108.176 221.492C107.545 222.491 106.572 223.332 105.258 224.016C103.969 224.7 102.366 225.041 100.446 225.041ZM114.871 224.647C114.608 224.647 114.384 224.568 114.2 224.41C114.043 224.226 113.964 224.003 113.964 223.74V197.554C113.964 197.291 114.043 197.081 114.2 196.923C114.384 196.739 114.608 196.647 114.871 196.647H116.843C117.105 196.647 117.316 196.739 117.474 196.923C117.658 197.081 117.75 197.291 117.75 197.554V206.743C118.512 205.77 119.406 205.034 120.431 204.534C121.457 204.008 122.732 203.746 124.257 203.746C126.781 203.746 128.739 204.561 130.133 206.191C131.552 207.794 132.262 209.937 132.262 212.619V223.74C132.262 224.003 132.17 224.226 131.986 224.41C131.828 224.568 131.618 224.647 131.355 224.647H129.383C129.12 224.647 128.897 224.568 128.713 224.41C128.555 224.226 128.476 224.003 128.476 223.74V212.816C128.476 210.949 128.016 209.503 127.096 208.478C126.202 207.453 124.901 206.94 123.192 206.94C121.535 206.94 120.208 207.466 119.209 208.517C118.236 209.543 117.75 210.976 117.75 212.816V223.74C117.75 224.003 117.658 224.226 117.474 224.41C117.316 224.568 117.105 224.647 116.843 224.647H114.871ZM146.159 225.041C143.451 225.041 141.282 224.213 139.652 222.557C138.048 220.874 137.167 218.587 137.009 215.695L136.97 214.354L137.009 213.053C137.193 210.213 138.087 207.952 139.691 206.27C141.321 204.587 143.464 203.746 146.119 203.746C149.038 203.746 151.299 204.679 152.902 206.546C154.506 208.386 155.308 210.884 155.308 214.039V214.709C155.308 214.972 155.216 215.195 155.032 215.379C154.874 215.537 154.664 215.616 154.401 215.616H140.756V215.971C140.835 217.68 141.347 219.139 142.294 220.348C143.267 221.531 144.542 222.123 146.119 222.123C147.329 222.123 148.315 221.886 149.077 221.413C149.866 220.914 150.444 220.401 150.812 219.875C151.049 219.56 151.22 219.376 151.325 219.323C151.456 219.244 151.68 219.205 151.995 219.205H153.928C154.164 219.205 154.362 219.27 154.519 219.402C154.677 219.533 154.756 219.717 154.756 219.954C154.756 220.532 154.388 221.229 153.652 222.044C152.942 222.859 151.93 223.569 150.615 224.174C149.327 224.752 147.841 225.041 146.159 225.041ZM151.562 212.895V212.777C151.562 210.962 151.062 209.49 150.063 208.36C149.09 207.203 147.776 206.624 146.119 206.624C144.463 206.624 143.148 207.203 142.176 208.36C141.229 209.49 140.756 210.962 140.756 212.777V212.895H151.562ZM24.756 267.647C24.5457 267.647 24.3617 267.568 24.2039 267.41C24.0462 267.253 23.9673 267.069 23.9673 266.858C23.9673 266.648 23.9805 266.503 24.0068 266.424L33.787 240.909C33.9974 240.331 34.418 240.041 35.049 240.041H37.7307C38.3617 240.041 38.7823 240.331 38.9927 240.909L48.7335 266.424L48.8124 266.858C48.8124 267.069 48.7335 267.253 48.5758 267.41C48.418 267.568 48.234 267.647 48.0237 267.647H46.0124C45.7232 267.647 45.4997 267.581 45.342 267.45C45.1842 267.292 45.079 267.134 45.0265 266.977L42.8575 261.377H29.9222L27.7532 266.977C27.7006 267.134 27.5823 267.292 27.3983 267.45C27.2406 267.581 27.0302 267.647 26.7673 267.647H24.756ZM41.7138 257.985L36.3898 243.985L31.0659 257.985H41.7138ZM53.1079 243.315C52.845 243.315 52.6215 243.236 52.4375 243.078C52.2797 242.894 52.2008 242.67 52.2008 242.408V240.278C52.2008 240.015 52.2797 239.792 52.4375 239.608C52.6215 239.424 52.845 239.331 53.1079 239.331H55.5924C55.8553 239.331 56.0788 239.424 56.2628 239.608C56.4469 239.792 56.5389 240.015 56.5389 240.278V242.408C56.5389 242.67 56.4469 242.894 56.2628 243.078C56.0788 243.236 55.8553 243.315 55.5924 243.315H53.1079ZM53.4234 267.647C53.1605 267.647 52.937 267.568 52.753 267.41C52.5952 267.226 52.5163 267.003 52.5163 266.74V248.047C52.5163 247.784 52.5952 247.574 52.753 247.416C52.937 247.232 53.1605 247.14 53.4234 247.14H55.3163C55.5793 247.14 55.7896 247.232 55.9473 247.416C56.1314 247.574 56.2234 247.784 56.2234 248.047V266.74C56.2234 267.003 56.1314 267.226 55.9473 267.41C55.7896 267.568 55.5793 267.647 55.3163 267.647H53.4234ZM62.9744 267.647C62.7115 267.647 62.4881 267.568 62.304 267.41C62.1463 267.226 62.0674 267.003 62.0674 266.74V248.086C62.0674 247.823 62.1463 247.6 62.304 247.416C62.4881 247.232 62.7115 247.14 62.9744 247.14H64.7885C65.0514 247.14 65.2749 247.232 65.4589 247.416C65.643 247.6 65.735 247.823 65.735 248.086V249.822C66.8129 248.034 68.6533 247.14 71.2561 247.14H72.7942C73.0571 247.14 73.2674 247.232 73.4251 247.416C73.6092 247.574 73.7012 247.784 73.7012 248.047V249.664C73.7012 249.927 73.6092 250.137 73.4251 250.295C73.2674 250.453 73.0571 250.531 72.7942 250.531H70.428C69.0082 250.531 67.8909 250.952 67.0758 251.793C66.2608 252.608 65.8533 253.726 65.8533 255.146V266.74C65.8533 267.003 65.7613 267.226 65.5773 267.41C65.3932 267.568 65.1697 267.647 64.9068 267.647H62.9744ZM80.0064 267.647C79.7435 267.647 79.52 267.568 79.336 267.41C79.1783 267.226 79.0994 267.003 79.0994 266.74V250.295H75.7473C75.4844 250.295 75.2609 250.216 75.0769 250.058C74.9191 249.874 74.8402 249.651 74.8402 249.388V248.047C74.8402 247.784 74.9191 247.574 75.0769 247.416C75.2609 247.232 75.4844 247.14 75.7473 247.14H79.0994V245.168C79.0994 240.699 81.3604 238.464 85.8825 238.464H88.0909C88.3539 238.464 88.5642 238.556 88.7219 238.74C88.906 238.898 88.998 239.108 88.998 239.371V240.712C88.998 240.975 88.906 241.198 88.7219 241.382C88.5642 241.54 88.3539 241.619 88.0909 241.619H85.9614C84.7783 241.619 83.9501 241.934 83.4769 242.565C83.0036 243.17 82.767 244.103 82.767 245.365V247.14H91.2064V239.371C91.2064 239.108 91.2853 238.898 91.4431 238.74C91.6271 238.556 91.8506 238.464 92.1135 238.464H93.9276C94.1905 238.464 94.4008 238.556 94.5585 238.74C94.7426 238.898 94.8346 239.108 94.8346 239.371V266.74C94.8346 267.003 94.7426 267.226 94.5585 267.41C94.4008 267.568 94.1905 267.647 93.9276 267.647H92.1135C91.8506 267.647 91.6271 267.568 91.4431 267.41C91.2853 267.226 91.2064 267.003 91.2064 266.74V250.295H82.767V266.74C82.767 267.003 82.675 267.226 82.4909 267.41C82.3332 267.568 82.1229 267.647 81.86 267.647H80.0064ZM109.095 268.041C106.203 268.041 103.955 267.226 102.352 265.596C100.774 263.966 99.9328 261.797 99.8276 259.089L99.7882 257.393L99.8276 255.698C99.9328 253.016 100.787 250.86 102.391 249.23C103.995 247.574 106.23 246.746 109.095 246.746C111.961 246.746 114.196 247.574 115.799 249.23C117.403 250.86 118.258 253.016 118.363 255.698C118.389 255.987 118.402 256.552 118.402 257.393C118.402 258.235 118.389 258.8 118.363 259.089C118.258 261.797 117.403 263.966 115.799 265.596C114.222 267.226 111.987 268.041 109.095 268.041ZM109.095 265.005C110.752 265.005 112.053 264.479 112.999 263.427C113.972 262.376 114.498 260.864 114.577 258.892C114.603 258.629 114.616 258.13 114.616 257.393C114.616 256.657 114.603 256.158 114.577 255.895C114.498 253.923 113.972 252.411 112.999 251.36C112.053 250.308 110.752 249.782 109.095 249.782C107.439 249.782 106.124 250.308 105.152 251.36C104.179 252.411 103.666 253.923 103.614 255.895L103.574 257.393L103.614 258.892C103.666 260.864 104.179 262.376 105.152 263.427C106.124 264.479 107.439 265.005 109.095 265.005ZM128.244 267.647C127.902 267.647 127.639 267.568 127.455 267.41C127.271 267.253 127.113 267.003 126.982 266.661L121.382 248.362L121.303 247.968C121.303 247.731 121.382 247.534 121.539 247.377C121.723 247.219 121.921 247.14 122.131 247.14H123.866C124.129 247.14 124.339 247.219 124.497 247.377C124.681 247.508 124.799 247.653 124.852 247.81L129.229 262.678L133.922 247.968C133.975 247.758 134.093 247.574 134.277 247.416C134.461 247.232 134.711 247.14 135.027 247.14H136.368C136.683 247.14 136.933 247.232 137.117 247.416C137.301 247.574 137.419 247.758 137.472 247.968L142.165 262.678L146.542 247.81C146.568 247.679 146.66 247.534 146.818 247.377C147.002 247.219 147.226 247.14 147.489 247.14H149.263C149.474 247.14 149.658 247.219 149.815 247.377C149.973 247.534 150.052 247.731 150.052 247.968L149.973 248.362L144.413 266.661C144.281 267.003 144.123 267.253 143.939 267.41C143.755 267.568 143.479 267.647 143.111 267.647H141.573C140.863 267.647 140.429 267.318 140.272 266.661L135.697 252.543L131.122 266.661C130.912 267.318 130.465 267.647 129.782 267.647H128.244Z" fill="#51504F"/>
    </g>
</svg>`;
  },
  '/static/elyra/kubeflow.svg': () => {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 276.93 274.55">
    <g id="Layer_2" data-name="Layer 2">
        <g id="Layer_1-2" data-name="Layer 1">
            <path d="M95.9,62.15,100,164.25l73.75-94.12a6.79,6.79,0,0,1,9.6-1.11l46,36.92-15-65.61Z" fill="#4279f4"/>
            <polygon points="102.55 182.98 167.97 182.98 127.8 150.75 102.55 182.98" fill="#0028aa"/>
            <polygon points="180.18 83.92 136.18 140.06 183.06 177.67 227.53 121.91 180.18 83.92" fill="#014bd1"/>
            <polygon points="83.56 52.3 83.57 52.29 122.26 3.77 59.87 33.82 44.46 101.33 83.56 52.3" fill="#bedcff"/>
            <polygon points="45.32 122.05 86.76 174.01 82.81 75.03 45.32 122.05" fill="#6ca1ff"/>
            <polygon points="202.31 28.73 142.65 0 105.52 46.56 202.31 28.73" fill="#a1c3ff"/>
            <path d="M1.6,272V227.22H7.34v23.41l20.48-23.41h6.4l-17.39,19.7,19,25.07H29.1l-15.92-20.8-5.84,6.65V272Z" fill="#4279f4" stroke="#4279f4" stroke-miterlimit="10" stroke-width="3.2"/>
            <path d="M41.62,262.21V240h5.43v22.39a4.67,4.67,0,0,0,2.35,4.19,11,11,0,0,0,11,0,4.69,4.69,0,0,0,2.33-4.19V240h5.43v22.19a9.08,9.08,0,0,1-4.1,7.87,16.2,16.2,0,0,1-18.37,0A9.07,9.07,0,0,1,41.62,262.21Z" fill="#4279f4" stroke="#4279f4" stroke-miterlimit="10" stroke-width="3.2"/>
            <path d="M77.46,272V224h5.43v16.81a29.29,29.29,0,0,1,9.32-1.73,13.1,13.1,0,0,1,6.2,1.41,10.71,10.71,0,0,1,4.18,3.74,18.07,18.07,0,0,1,2.23,5.06,21.26,21.26,0,0,1,.73,5.58q0,8.43-4.38,12.79T87.35,272Zm5.43-4.87h4.55q6.77,0,9.72-2.95t3-9.51a14.21,14.21,0,0,0-2-7.52,6.55,6.55,0,0,0-6-3.22,24.73,24.73,0,0,0-9.25,1.54Z" fill="#4279f4" stroke="#4279f4" stroke-miterlimit="10" stroke-width="3.2"/>
            <path d="M112.36,255.94q0-7.71,4.09-12.3a13.75,13.75,0,0,1,10.8-4.59q13.35,0,13.36,18.86H117.79a12.3,12.3,0,0,0,2.9,7.07q2.59,3.11,7.9,3.1a24.92,24.92,0,0,0,10.55-2v5a27.74,27.74,0,0,1-9.86,1.87,19.83,19.83,0,0,1-7.7-1.37,13.31,13.31,0,0,1-5.28-3.76,16.21,16.21,0,0,1-3-5.38A20.84,20.84,0,0,1,112.36,255.94Zm5.62-2.12h17.26a14.91,14.91,0,0,0-2.37-7.12,6.44,6.44,0,0,0-5.62-2.78,8.2,8.2,0,0,0-6.21,2.72A12.07,12.07,0,0,0,118,253.82Z" fill="#4279f4" stroke="#4279f4" stroke-miterlimit="10" stroke-width="3.2"/>
            <path d="M147.32,244.89V240h5v-7.59a8.14,8.14,0,0,1,2.31-6.05,7.79,7.79,0,0,1,5.69-2.28h7.86V229h-5c-2.21,0-3.67.45-4.37,1.34s-1.06,2.55-1.06,5V240h8.46v4.87h-8.46V272h-5.44v-27.1Z" fill="#0028aa" stroke="#0028aa" stroke-miterlimit="10" stroke-width="3.2"/>
            <path d="M175.26,272V224h5.43v48Z" fill="#0028aa" stroke="#0028aa" stroke-miterlimit="10" stroke-width="3.2"/>
            <path d="M194.41,268.05a17.86,17.86,0,1,1,12.33,4.9A16.57,16.57,0,0,1,194.41,268.05Zm3.84-20.65a13.16,13.16,0,0,0,0,17.2,12.07,12.07,0,0,0,17,0,13.09,13.09,0,0,0,0-17.2,12.07,12.07,0,0,0-17,0Z" fill="#0028aa" stroke="#0028aa" stroke-miterlimit="10" stroke-width="3.2"/>
            <path d="M228.45,240h5.75l7.3,25.32L248.93,240h5.36l7.34,25.34L269,240h5.74L264.7,272h-6.12l-6.83-24.58L245,272h-6.47Z" fill="#0028aa" stroke="#0028aa" stroke-miterlimit="10" stroke-width="3.2"/>
        </g>
    </g>
</svg>`;
  },
  '/static/elyra/pipeline-flow.svg': () => {
    return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="elyra-pipeline-editor-icon" viewBox="0 0 32 32" title="Elyra Pipeline Editor">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <path class="jp-icon3 jp-icon-selectable" fill="#000000" d="M20,23 L11.86,23 C11.7609757,22.6493104 11.616411,22.3131134 11.43,22 L22,11.43 C22.6019656,11.7993928 23.293741,11.9965488 24,12 C26.0803346,12.0067496 27.8185594,10.4177446 27.9980602,8.34515757 C28.177561,6.27257049 26.7384074,4.4083819 24.6878883,4.05737018 C22.6373692,3.70635845 20.6600973,4.98571688 20.14,7 L11.86,7 C11.356433,5.04969328 9.48121328,3.77807479 7.48299948,4.03188121 C5.48478569,4.28568764 3.98701665,5.98573188 3.98701665,8 C3.98701665,10.0142681 5.48478569,11.7143124 7.48299948,11.9681188 C9.48121328,12.2219252 11.356433,10.9503067 11.86,9 L20.14,9 C20.2390243,9.35068963 20.383589,9.68688662 20.57,10 L10,20.57 C9.39803439,20.2006072 8.70625898,20.0034512 8,20 C5.91966537,19.9932504 4.18144061,21.5822554 4.00193981,23.6548424 C3.822439,25.7274295 5.26159259,27.5916181 7.31211167,27.9426298 C9.36263076,28.2936415 11.3399027,27.0142831 11.86,25 L20,25 L20,28 L28,28 L28,20 L20,20 L20,23 Z M8,10 C6.8954305,10 6,9.1045695 6,8 C6,6.8954305 6.8954305,6 8,6 C9.1045695,6 10,6.8954305 10,8 C10,8.53043298 9.78928632,9.03914081 9.41421356,9.41421356 C9.03914081,9.78928632 8.53043298,10 8,10 Z M24,6 C25.1045695,6 26,6.8954305 26,8 C26,9.1045695 25.1045695,10 24,10 C22.8954305,10 22,9.1045695 22,8 C22,6.8954305 22.8954305,6 24,6 Z M8,26 C6.8954305,26 6,25.1045695 6,24 C6,22.8954305 6.8954305,22 8,22 C9.1045695,22 10,22.8954305 10,24 C10,25.1045695 9.1045695,26 8,26 Z M22,22 L26,22 L26,26 L22,26 L22,22 Z"/>
    </g>
  </svg>`;
  },
  '/elyra/metadata/runtime-images': () => {
    return {
      'runtime-images': [
        {
          name: 'anaconda',
          display_name: 'Anaconda (2021.11) with Python 3.x',
          metadata: {
            description: 'Anaconda 2021.11',
            image_name:
              'continuumio/anaconda3@sha256:a2816acd3acda208d92e0bf6c11eb41fda9009ea20f24e123dbf84bb4bd4c4b8',
            tags: ['anaconda']
          },
          schema_name: 'runtime-image'
        },
        {
          name: 'pandas',
          display_name: 'Pandas 1.4.1',
          metadata: {
            description: 'Pandas 1.4.1',
            image_name:
              'amancevice/pandas@sha256:f74bef70689b19d3cd610ef67227fce1c9a6ed8fa950ac2aff39ce72310d5520',
            tags: ['pandas']
          },
          schema_name: 'runtime-image'
        },
        {
          name: 'pytorch-devel',
          display_name: 'Pytorch 1.4 with CUDA-devel',
          metadata: {
            description: 'PyTorch 1.4 (with GPU support)',
            image_name:
              'pytorch/pytorch@sha256:c612782acc39256aac0637d58d297644066c62f6f84f0b88cfdc335bb25d0d22',
            tags: ['gpu', 'pytorch']
          },
          schema_name: 'runtime-image'
        },
        {
          name: 'pytorch-runtime',
          display_name: 'Pytorch 1.4 with CUDA-runtime',
          metadata: {
            description: 'PyTorch 1.4 (with GPU support)',
            image_name:
              'pytorch/pytorch@sha256:ee783a4c0fccc7317c150450e84579544e171dd01a3f76cf2711262aced85bf7',
            tags: ['gpu', 'pytorch']
          },
          schema_name: 'runtime-image'
        },
        {
          name: 'r',
          display_name: 'R Script',
          metadata: {
            description: 'R Script',
            image_name:
              'jupyter/r-notebook@sha256:08b7c3a1be31deac36cd9d65db6f6a4d58dc0cba32087101f3166d093c1a9c82',
            tags: ['R']
          },
          schema_name: 'runtime-image'
        },
        {
          name: 'tensorflow_2x_gpu_py3',
          display_name: 'Tensorflow 2.8.0 with GPU',
          metadata: {
            description: 'TensorFlow 2.8 (with GPU support)',
            image_name:
              'tensorflow/tensorflow@sha256:1e03623e335aac1610b1a3cfa6a96cf10156acb095287f9d6031df3980148663',
            tags: ['gpu', 'tensorflow']
          },
          schema_name: 'runtime-image'
        },
        {
          name: 'tensorflow_2x_py3',
          display_name: 'Tensorflow 2.8.0',
          metadata: {
            description: 'TensorFlow 2.8',
            image_name:
              'tensorflow/tensorflow@sha256:7c01f75d58fadc2cd1109d5baac1925ed131e05925d840b1b49363c794d1c4db',
            tags: ['tensorflow']
          },
          schema_name: 'runtime-image'
        }
      ]
    };
  },
  '/elyra/pipeline/components/local': () => {
    return {
      version: '3.0',
      categories: [
        {
          id: 'Elyra',
          label: 'Elyra',
          node_types: [
            {
              op: 'execute-notebook-node',
              description: 'Run notebook file',
              id: 'notebook',
              image: '',
              label: 'Notebook',
              type: 'execution_node',
              inputs: [
                {
                  id: 'inPort',
                  app_data: {
                    ui_data: {
                      cardinality: { min: 0, max: -1 },
                      label: 'Input Port'
                    }
                  }
                }
              ],
              outputs: [
                {
                  id: 'outPort',
                  app_data: {
                    ui_data: {
                      cardinality: { min: 0, max: -1 },
                      label: 'Output Port'
                    }
                  }
                }
              ],
              parameters: {},
              app_data: {
                extensions: ['.ipynb'],
                parameter_refs: { filehandler: 'filename' },
                image: '',
                ui_data: {
                  description: 'Run notebook file',
                  label: 'Notebook',
                  image: '',
                  x_pos: 0,
                  y_pos: 0
                }
              }
            },
            {
              op: 'execute-python-node',
              description: 'Run Python script',
              id: 'python-script',
              image: '',
              label: 'Python Script',
              type: 'execution_node',
              inputs: [
                {
                  id: 'inPort',
                  app_data: {
                    ui_data: {
                      cardinality: { min: 0, max: -1 },
                      label: 'Input Port'
                    }
                  }
                }
              ],
              outputs: [
                {
                  id: 'outPort',
                  app_data: {
                    ui_data: {
                      cardinality: { min: 0, max: -1 },
                      label: 'Output Port'
                    }
                  }
                }
              ],
              parameters: {},
              app_data: {
                extensions: ['.py'],
                parameter_refs: { filehandler: 'filename' },
                image: '',
                ui_data: {
                  description: 'Run Python script',
                  label: 'Python Script',
                  image: '',
                  x_pos: 0,
                  y_pos: 0
                }
              }
            },
            {
              op: 'execute-r-node',
              description: 'Run R script',
              id: 'r-script',
              image: '',
              label: 'R Script',
              type: 'execution_node',
              inputs: [
                {
                  id: 'inPort',
                  app_data: {
                    ui_data: {
                      cardinality: { min: 0, max: -1 },
                      label: 'Input Port'
                    }
                  }
                }
              ],
              outputs: [
                {
                  id: 'outPort',
                  app_data: {
                    ui_data: {
                      cardinality: { min: 0, max: -1 },
                      label: 'Output Port'
                    }
                  }
                }
              ],
              parameters: {},
              app_data: {
                extensions: ['.r'],
                parameter_refs: { filehandler: 'filename' },
                image: '',
                ui_data: {
                  description: 'Run R script',
                  label: 'R Script',
                  image: '',
                  x_pos: 0,
                  y_pos: 0
                }
              }
            }
          ]
        }
      ]
    };
  },
  '/elyra/pipeline/local/properties': () => {
    return {
      type: 'object',
      properties: {
        name: {
          title: 'Pipeline Name',
          type: 'string',
          uihints: { 'ui:readonly': true }
        },
        runtime: {
          title: 'Pipeline Runtime',
          type: 'string',
          uihints: { 'ui:readonly': true }
        },
        description: {
          title: 'Pipeline Description',
          type: 'string',
          uihints: {
            'ui:placeholder': 'Pipeline Description',
            'ui:widget': 'textarea'
          }
        },
        pipeline_defaults: {
          type: 'object',
          properties: {
            cos_object_prefix: {
              title: 'Object Storage path prefix',
              type: 'string',
              description:
                'For generic components, this path prefix is used when storing artifacts on Object Storage.',
              uihints: { 'ui:placeholder': 'project/subproject' }
            },
            node_defaults_header: {
              type: 'null',
              title: 'Node Defaults',
              description:
                'Default values are applied to all nodes in this pipeline and can be customized in each node.',
              uihints: { 'ui:field': 'header' }
            },
            kubernetes_tolerations: {
              title: 'Kubernetes Tolerations',
              description:
                'Kubernetes tolerations to apply to the pod where the node is executed.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  key: { title: 'Key', type: 'string', default: '' },
                  operator: {
                    title: 'Operator',
                    type: 'string',
                    default: 'Equal',
                    enum: ['Equal', 'Exists']
                  },
                  value: { title: 'Value', type: 'string', default: '' },
                  effect: {
                    title: 'Effect',
                    type: 'string',
                    default: '',
                    enum: ['', 'NoExecute', 'NoSchedule', 'PreferNoSchedule']
                  }
                },
                required: ['operator']
              },
              uihints: {
                items: {
                  key: { 'ui:placeholder': 'key' },
                  value: { 'ui:placeholder': 'value' },
                  effect: { 'ui:placeholder': 'NoSchedule' }
                }
              }
            },
            mounted_volumes: {
              title: 'Data Volumes',
              description:
                'Volumes to be mounted in this node. The specified Persistent Volume Claims must exist in the Kubernetes namespace where the node is executed or this node will not run.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  path: { title: 'Mount Path', type: 'string', default: '' },
                  pvc_name: {
                    title: 'Persistent Volume Claim Name',
                    type: 'string',
                    default: ''
                  },
                  sub_path: { title: 'Sub Path', type: 'string', default: '' },
                  read_only: {
                    title: 'Mount volume read-only',
                    type: 'boolean',
                    default: false
                  }
                },
                required: ['path', 'pvc_name']
              },
              uihints: {
                items: {
                  path: { 'ui:placeholder': '/mount/path' },
                  pvc_name: { 'ui:placeholder': 'pvc-name' },
                  sub_path: { 'ui:placeholder': 'relative/path/within/volume' },
                  read_only: { 'ui:placeholder': ' ' }
                }
              }
            },
            kubernetes_pod_annotations: {
              title: 'Kubernetes Pod Annotations',
              description:
                'Metadata to be added to this node. The metadata is exposed as annotation in the Kubernetes pod that executes this node.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  key: { title: 'Key', type: 'string', default: '' },
                  value: { title: 'Value', type: 'string', default: '' }
                },
                required: ['key']
              },
              uihints: {
                items: {
                  key: { 'ui:placeholder': 'annotation_key' },
                  value: { 'ui:placeholder': 'annotation_value' }
                }
              }
            },
            kubernetes_pod_labels: {
              title: 'Kubernetes Pod Labels',
              description:
                'Metadata to be added to this node. The metadata is exposed as label in the Kubernetes pod that executes this node.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  key: { title: 'Key', type: 'string', default: '' },
                  value: { title: 'Value', type: 'string', default: '' }
                },
                required: ['key']
              },
              uihints: {
                items: {
                  key: { 'ui:placeholder': 'label_key' },
                  value: { 'ui:placeholder': 'label_value' }
                }
              }
            },
            kubernetes_shared_mem_size: {
              title: 'Shared Memory Size',
              description:
                'Configure a custom shared memory size in gigabytes (10^9 bytes) for the pod that executes a node. A custom value is assigned if the size property value is a number greater than zero.',
              type: 'object',
              properties: {
                size: { title: 'Memory Size (GB)', type: 'integer', minimum: 0 }
              },
              required: [],
              uihints: { size: { 'ui:placeholder': 0 } }
            },
            generic_node_defaults_header: {
              type: 'null',
              title: 'Generic Node Defaults',
              description:
                'Default values are applied to all generic nodes in this pipeline and can be customized in each node.',
              uihints: { 'ui:field': 'header' }
            },
            runtime_image: {
              title: 'Runtime Image',
              description: 'Container image used as execution environment.',
              type: 'string'
            },
            env_vars: {
              title: 'Environment Variables',
              description:
                'Environment variables to be set on the execution environment.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  env_var: {
                    title: 'Environment Variable',
                    type: 'string',
                    default: ''
                  },
                  value: { title: 'Value', type: 'string', default: '' }
                },
                required: ['env_var']
              },
              uihints: {
                items: {
                  env_var: { 'ui:placeholder': 'ENV_VAR' },
                  value: { 'ui:placeholder': 'value' }
                },
                canRefresh: true
              }
            },
            kubernetes_secrets: {
              title: 'Kubernetes Secrets',
              description:
                'Kubernetes secrets to make available as environment variables to this node. The secret name and key given must be present in the Kubernetes namespace where the node is executed or this node will not run.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  env_var: {
                    title: 'Environment Variable',
                    type: 'string',
                    default: ''
                  },
                  name: { title: 'Secret Name', type: 'string', default: '' },
                  key: { title: 'Secret Key', type: 'string', default: '' }
                },
                required: ['env_var', 'name', 'key']
              },
              uihints: {
                items: {
                  env_var: { 'ui:placeholder': 'ENV_VAR' },
                  name: { 'ui:placeholder': 'secret-name' },
                  key: { 'ui:placeholder': 'secret-key' }
                }
              }
            },
            custom_node_defaults_header: {
              type: 'null',
              title: 'Custom Node Defaults',
              description:
                'Default values are applied to all custom nodes in this pipeline and can be customized in each node.',
              uihints: { 'ui:field': 'header' }
            },
            disable_node_caching: {
              title: 'Disable node caching',
              description:
                'Disable caching to force node re-execution in the target runtime environment.',
              type: 'string',
              enum: ['True', 'False'],
              uihints: { 'ui:placeholder': 'Use runtime default' }
            }
          }
        }
      }
    };
  },
  '/elyra/pipeline/local/parameters': () => {
    return {
      message:
        "Runtime processor type 'Local' does not support pipeline parameters."
    };
  },
  '/elyra/pipeline/components/local/notebook/properties': () => {
    return {
      type: 'object',
      properties: {
        label: {
          title: 'Label',
          description: 'A custom label for the node.',
          type: 'string'
        },
        component_parameters: {
          type: 'object',
          properties: {
            inputs_header: {
              type: 'null',
              title: 'Inputs',
              description: 'Input properties for this component.',
              uihints: { 'ui:field': 'header' }
            },
            filename: {
              type: 'string',
              title: 'Filename',
              description: 'The path to the Notebook.',
              uihints: { 'ui:widget': 'file', extensions: ['.ipynb'] }
            },
            runtime_image: {
              type: 'string',
              title: 'Runtime Image',
              required: true,
              description: 'Container image used as execution environment.',
              uihints: { items: [] }
            },
            cpu: {
              type: 'integer',
              title: 'CPU',
              description:
                'For CPU-intensive workloads, you can choose more than 1 CPU (e.g. 1.5).',
              minimum: 0
            },
            memory: {
              type: 'integer',
              title: 'RAM(GB)',
              description: 'The total amount of RAM specified.',
              minimum: 0
            },
            gpu: {
              type: 'integer',
              title: 'GPU',
              description:
                'For GPU-intensive workloads, you can choose more than 1 GPU. Must be an integer.',
              minimum: 0
            },
            gpu_vendor: {
              type: 'string',
              title: 'GPU Vendor',
              description:
                "GPU Vendor, or K8s GPU resource type, default 'nvidia.com/gpu'.",
              uihints: { 'ui:placeholder': 'nvidia.com/gpu' }
            },
            dependencies: {
              title: 'File Dependencies',
              description:
                'Local file dependencies that need to be copied to remote execution environment.',
              type: 'array',
              items: { type: 'string', default: '' },
              default: [],
              uihints: { files: true, items: { 'ui:placeholder': '*.py' } }
            },
            include_subdirectories: {
              type: 'boolean',
              title: 'Include Subdirectories',
              description:
                'Recursively include subdirectories when submitting a pipeline (This may increase submission time).',
              default: false
            },
            outputs_header: {
              type: 'null',
              title: 'Outputs',
              description: 'Outputs produced by this component.',
              uihints: { 'ui:field': 'header' }
            },
            outputs: {
              title: 'Output Files',
              description:
                'Files generated during execution that will become available to all subsequent pipeline steps.',
              type: 'array',
              items: { type: 'string', default: '' },
              default: [],
              uihints: { items: { 'ui:placeholder': '*.csv' } }
            },
            additional_properties_header: {
              type: 'null',
              title: 'Additional Properties',
              description:
                'Additional properties used by Elyra that are not given in the component definition.',
              uihints: { 'ui:field': 'header' }
            },
            env_vars: {
              title: 'Environment Variables',
              description:
                'Environment variables to be set on the execution environment.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  env_var: {
                    title: 'Environment Variable',
                    type: 'string',
                    default: ''
                  },
                  value: { title: 'Value', type: 'string', default: '' }
                },
                required: ['env_var']
              },
              uihints: {
                items: {
                  env_var: { 'ui:placeholder': 'ENV_VAR' },
                  value: { 'ui:placeholder': 'value' }
                },
                canRefresh: true
              }
            },
            kubernetes_pod_annotations: {
              title: 'Kubernetes Pod Annotations',
              description:
                'Metadata to be added to this node. The metadata is exposed as annotation in the Kubernetes pod that executes this node.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  key: { title: 'Key', type: 'string', default: '' },
                  value: { title: 'Value', type: 'string', default: '' }
                },
                required: ['key']
              },
              uihints: {
                items: {
                  key: { 'ui:placeholder': 'annotation_key' },
                  value: { 'ui:placeholder': 'annotation_value' }
                }
              }
            },
            kubernetes_pod_labels: {
              title: 'Kubernetes Pod Labels',
              description:
                'Metadata to be added to this node. The metadata is exposed as label in the Kubernetes pod that executes this node.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  key: { title: 'Key', type: 'string', default: '' },
                  value: { title: 'Value', type: 'string', default: '' }
                },
                required: ['key']
              },
              uihints: {
                items: {
                  key: { 'ui:placeholder': 'label_key' },
                  value: { 'ui:placeholder': 'label_value' }
                }
              }
            },
            kubernetes_secrets: {
              title: 'Kubernetes Secrets',
              description:
                'Kubernetes secrets to make available as environment variables to this node. The secret name and key given must be present in the Kubernetes namespace where the node is executed or this node will not run.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  env_var: {
                    title: 'Environment Variable',
                    type: 'string',
                    default: ''
                  },
                  name: { title: 'Secret Name', type: 'string', default: '' },
                  key: { title: 'Secret Key', type: 'string', default: '' }
                },
                required: ['env_var', 'name', 'key']
              },
              uihints: {
                items: {
                  env_var: { 'ui:placeholder': 'ENV_VAR' },
                  name: { 'ui:placeholder': 'secret-name' },
                  key: { 'ui:placeholder': 'secret-key' }
                }
              }
            },
            kubernetes_shared_mem_size: {
              title: 'Shared Memory Size',
              description:
                'Configure a custom shared memory size in gigabytes (10^9 bytes) for the pod that executes a node. A custom value is assigned if the size property value is a number greater than zero.',
              type: 'object',
              properties: {
                size: { title: 'Memory Size (GB)', type: 'integer', minimum: 0 }
              },
              required: [],
              uihints: { size: { 'ui:placeholder': 0 } }
            },
            kubernetes_tolerations: {
              title: 'Kubernetes Tolerations',
              description:
                'Kubernetes tolerations to apply to the pod where the node is executed.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  key: { title: 'Key', type: 'string', default: '' },
                  operator: {
                    title: 'Operator',
                    type: 'string',
                    default: 'Equal',
                    enum: ['Equal', 'Exists']
                  },
                  value: { title: 'Value', type: 'string', default: '' },
                  effect: {
                    title: 'Effect',
                    type: 'string',
                    default: '',
                    enum: ['', 'NoExecute', 'NoSchedule', 'PreferNoSchedule']
                  }
                },
                required: ['operator']
              },
              uihints: {
                items: {
                  key: { 'ui:placeholder': 'key' },
                  value: { 'ui:placeholder': 'value' },
                  effect: { 'ui:placeholder': 'NoSchedule' }
                }
              }
            },
            mounted_volumes: {
              title: 'Data Volumes',
              description:
                'Volumes to be mounted in this node. The specified Persistent Volume Claims must exist in the Kubernetes namespace where the node is executed or this node will not run.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  path: { title: 'Mount Path', type: 'string', default: '' },
                  pvc_name: {
                    title: 'Persistent Volume Claim Name',
                    type: 'string',
                    default: ''
                  },
                  sub_path: { title: 'Sub Path', type: 'string', default: '' },
                  read_only: {
                    title: 'Mount volume read-only',
                    type: 'boolean',
                    default: false
                  }
                },
                required: ['path', 'pvc_name']
              },
              uihints: {
                items: {
                  path: { 'ui:placeholder': '/mount/path' },
                  pvc_name: { 'ui:placeholder': 'pvc-name' },
                  sub_path: { 'ui:placeholder': 'relative/path/within/volume' },
                  read_only: { 'ui:placeholder': ' ' }
                }
              }
            }
          },
          required: ['filename', 'runtime_image']
        }
      },
      required: ['component_parameters']
    };
  },
  '/elyra/pipeline/components/local/python-script/properties': () => {
    return {
      type: 'object',
      properties: {
        label: {
          title: 'Label',
          description: 'A custom label for the node.',
          type: 'string'
        },
        component_parameters: {
          type: 'object',
          properties: {
            inputs_header: {
              type: 'null',
              title: 'Inputs',
              description: 'Input properties for this component.',
              uihints: { 'ui:field': 'header' }
            },
            filename: {
              type: 'string',
              title: 'Filename',
              description: 'The path to the Python Script.',
              uihints: { 'ui:widget': 'file', extensions: ['.py'] }
            },
            runtime_image: {
              type: 'string',
              title: 'Runtime Image',
              required: true,
              description: 'Container image used as execution environment.',
              uihints: { items: [] }
            },
            cpu: {
              type: 'integer',
              title: 'CPU',
              description:
                'For CPU-intensive workloads, you can choose more than 1 CPU (e.g. 1.5).',
              minimum: 0
            },
            memory: {
              type: 'integer',
              title: 'RAM(GB)',
              description: 'The total amount of RAM specified.',
              minimum: 0
            },
            gpu: {
              type: 'integer',
              title: 'GPU',
              description:
                'For GPU-intensive workloads, you can choose more than 1 GPU. Must be an integer.',
              minimum: 0
            },
            gpu_vendor: {
              type: 'string',
              title: 'GPU Vendor',
              description:
                "GPU Vendor, or K8s GPU resource type, default 'nvidia.com/gpu'.",
              uihints: { 'ui:placeholder': 'nvidia.com/gpu' }
            },
            dependencies: {
              title: 'File Dependencies',
              description:
                'Local file dependencies that need to be copied to remote execution environment.',
              type: 'array',
              items: { type: 'string', default: '' },
              default: [],
              uihints: { files: true, items: { 'ui:placeholder': '*.py' } }
            },
            include_subdirectories: {
              type: 'boolean',
              title: 'Include Subdirectories',
              description:
                'Recursively include subdirectories when submitting a pipeline (This may increase submission time).',
              default: false
            },
            outputs_header: {
              type: 'null',
              title: 'Outputs',
              description: 'Outputs produced by this component.',
              uihints: { 'ui:field': 'header' }
            },
            outputs: {
              title: 'Output Files',
              description:
                'Files generated during execution that will become available to all subsequent pipeline steps.',
              type: 'array',
              items: { type: 'string', default: '' },
              default: [],
              uihints: { items: { 'ui:placeholder': '*.csv' } }
            },
            additional_properties_header: {
              type: 'null',
              title: 'Additional Properties',
              description:
                'Additional properties used by Elyra that are not given in the component definition.',
              uihints: { 'ui:field': 'header' }
            },
            env_vars: {
              title: 'Environment Variables',
              description:
                'Environment variables to be set on the execution environment.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  env_var: {
                    title: 'Environment Variable',
                    type: 'string',
                    default: ''
                  },
                  value: { title: 'Value', type: 'string', default: '' }
                },
                required: ['env_var']
              },
              uihints: {
                items: {
                  env_var: { 'ui:placeholder': 'ENV_VAR' },
                  value: { 'ui:placeholder': 'value' }
                },
                canRefresh: true
              }
            },
            kubernetes_pod_annotations: {
              title: 'Kubernetes Pod Annotations',
              description:
                'Metadata to be added to this node. The metadata is exposed as annotation in the Kubernetes pod that executes this node.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  key: { title: 'Key', type: 'string', default: '' },
                  value: { title: 'Value', type: 'string', default: '' }
                },
                required: ['key']
              },
              uihints: {
                items: {
                  key: { 'ui:placeholder': 'annotation_key' },
                  value: { 'ui:placeholder': 'annotation_value' }
                }
              }
            },
            kubernetes_pod_labels: {
              title: 'Kubernetes Pod Labels',
              description:
                'Metadata to be added to this node. The metadata is exposed as label in the Kubernetes pod that executes this node.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  key: { title: 'Key', type: 'string', default: '' },
                  value: { title: 'Value', type: 'string', default: '' }
                },
                required: ['key']
              },
              uihints: {
                items: {
                  key: { 'ui:placeholder': 'label_key' },
                  value: { 'ui:placeholder': 'label_value' }
                }
              }
            },
            kubernetes_secrets: {
              title: 'Kubernetes Secrets',
              description:
                'Kubernetes secrets to make available as environment variables to this node. The secret name and key given must be present in the Kubernetes namespace where the node is executed or this node will not run.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  env_var: {
                    title: 'Environment Variable',
                    type: 'string',
                    default: ''
                  },
                  name: { title: 'Secret Name', type: 'string', default: '' },
                  key: { title: 'Secret Key', type: 'string', default: '' }
                },
                required: ['env_var', 'name', 'key']
              },
              uihints: {
                items: {
                  env_var: { 'ui:placeholder': 'ENV_VAR' },
                  name: { 'ui:placeholder': 'secret-name' },
                  key: { 'ui:placeholder': 'secret-key' }
                }
              }
            },
            kubernetes_shared_mem_size: {
              title: 'Shared Memory Size',
              description:
                'Configure a custom shared memory size in gigabytes (10^9 bytes) for the pod that executes a node. A custom value is assigned if the size property value is a number greater than zero.',
              type: 'object',
              properties: {
                size: { title: 'Memory Size (GB)', type: 'integer', minimum: 0 }
              },
              required: [],
              uihints: { size: { 'ui:placeholder': 0 } }
            },
            kubernetes_tolerations: {
              title: 'Kubernetes Tolerations',
              description:
                'Kubernetes tolerations to apply to the pod where the node is executed.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  key: { title: 'Key', type: 'string', default: '' },
                  operator: {
                    title: 'Operator',
                    type: 'string',
                    default: 'Equal',
                    enum: ['Equal', 'Exists']
                  },
                  value: { title: 'Value', type: 'string', default: '' },
                  effect: {
                    title: 'Effect',
                    type: 'string',
                    default: '',
                    enum: ['', 'NoExecute', 'NoSchedule', 'PreferNoSchedule']
                  }
                },
                required: ['operator']
              },
              uihints: {
                items: {
                  key: { 'ui:placeholder': 'key' },
                  value: { 'ui:placeholder': 'value' },
                  effect: { 'ui:placeholder': 'NoSchedule' }
                }
              }
            },
            mounted_volumes: {
              title: 'Data Volumes',
              description:
                'Volumes to be mounted in this node. The specified Persistent Volume Claims must exist in the Kubernetes namespace where the node is executed or this node will not run.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  path: { title: 'Mount Path', type: 'string', default: '' },
                  pvc_name: {
                    title: 'Persistent Volume Claim Name',
                    type: 'string',
                    default: ''
                  },
                  sub_path: { title: 'Sub Path', type: 'string', default: '' },
                  read_only: {
                    title: 'Mount volume read-only',
                    type: 'boolean',
                    default: false
                  }
                },
                required: ['path', 'pvc_name']
              },
              uihints: {
                items: {
                  path: { 'ui:placeholder': '/mount/path' },
                  pvc_name: { 'ui:placeholder': 'pvc-name' },
                  sub_path: { 'ui:placeholder': 'relative/path/within/volume' },
                  read_only: { 'ui:placeholder': ' ' }
                }
              }
            }
          },
          required: ['filename', 'runtime_image']
        }
      },
      required: ['component_parameters']
    };
  },
  '/elyra/pipeline/components/local/r-script/properties': () => {
    return {
      type: 'object',
      properties: {
        label: {
          title: 'Label',
          description: 'A custom label for the node.',
          type: 'string'
        },
        component_parameters: {
          type: 'object',
          properties: {
            inputs_header: {
              type: 'null',
              title: 'Inputs',
              description: 'Input properties for this component.',
              uihints: { 'ui:field': 'header' }
            },
            filename: {
              type: 'string',
              title: 'Filename',
              description: 'The path to the R Script.',
              uihints: { 'ui:widget': 'file', extensions: ['.r'] }
            },
            runtime_image: {
              type: 'string',
              title: 'Runtime Image',
              required: true,
              description: 'Container image used as execution environment.',
              uihints: { items: [] }
            },
            cpu: {
              type: 'integer',
              title: 'CPU',
              description:
                'For CPU-intensive workloads, you can choose more than 1 CPU (e.g. 1.5).',
              minimum: 0
            },
            memory: {
              type: 'integer',
              title: 'RAM(GB)',
              description: 'The total amount of RAM specified.',
              minimum: 0
            },
            gpu: {
              type: 'integer',
              title: 'GPU',
              description:
                'For GPU-intensive workloads, you can choose more than 1 GPU. Must be an integer.',
              minimum: 0
            },
            gpu_vendor: {
              type: 'string',
              title: 'GPU Vendor',
              description:
                "GPU Vendor, or K8s GPU resource type, default 'nvidia.com/gpu'.",
              uihints: { 'ui:placeholder': 'nvidia.com/gpu' }
            },
            dependencies: {
              title: 'File Dependencies',
              description:
                'Local file dependencies that need to be copied to remote execution environment.',
              type: 'array',
              items: { type: 'string', default: '' },
              default: [],
              uihints: { files: true, items: { 'ui:placeholder': '*.py' } }
            },
            include_subdirectories: {
              type: 'boolean',
              title: 'Include Subdirectories',
              description:
                'Recursively include subdirectories when submitting a pipeline (This may increase submission time).',
              default: false
            },
            outputs_header: {
              type: 'null',
              title: 'Outputs',
              description: 'Outputs produced by this component.',
              uihints: { 'ui:field': 'header' }
            },
            outputs: {
              title: 'Output Files',
              description:
                'Files generated during execution that will become available to all subsequent pipeline steps.',
              type: 'array',
              items: { type: 'string', default: '' },
              default: [],
              uihints: { items: { 'ui:placeholder': '*.csv' } }
            },
            additional_properties_header: {
              type: 'null',
              title: 'Additional Properties',
              description:
                'Additional properties used by Elyra that are not given in the component definition.',
              uihints: { 'ui:field': 'header' }
            },
            env_vars: {
              title: 'Environment Variables',
              description:
                'Environment variables to be set on the execution environment.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  env_var: {
                    title: 'Environment Variable',
                    type: 'string',
                    default: ''
                  },
                  value: { title: 'Value', type: 'string', default: '' }
                },
                required: ['env_var']
              },
              uihints: {
                items: {
                  env_var: { 'ui:placeholder': 'ENV_VAR' },
                  value: { 'ui:placeholder': 'value' }
                },
                canRefresh: true
              }
            },
            kubernetes_pod_annotations: {
              title: 'Kubernetes Pod Annotations',
              description:
                'Metadata to be added to this node. The metadata is exposed as annotation in the Kubernetes pod that executes this node.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  key: { title: 'Key', type: 'string', default: '' },
                  value: { title: 'Value', type: 'string', default: '' }
                },
                required: ['key']
              },
              uihints: {
                items: {
                  key: { 'ui:placeholder': 'annotation_key' },
                  value: { 'ui:placeholder': 'annotation_value' }
                }
              }
            },
            kubernetes_pod_labels: {
              title: 'Kubernetes Pod Labels',
              description:
                'Metadata to be added to this node. The metadata is exposed as label in the Kubernetes pod that executes this node.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  key: { title: 'Key', type: 'string', default: '' },
                  value: { title: 'Value', type: 'string', default: '' }
                },
                required: ['key']
              },
              uihints: {
                items: {
                  key: { 'ui:placeholder': 'label_key' },
                  value: { 'ui:placeholder': 'label_value' }
                }
              }
            },
            kubernetes_secrets: {
              title: 'Kubernetes Secrets',
              description:
                'Kubernetes secrets to make available as environment variables to this node. The secret name and key given must be present in the Kubernetes namespace where the node is executed or this node will not run.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  env_var: {
                    title: 'Environment Variable',
                    type: 'string',
                    default: ''
                  },
                  name: { title: 'Secret Name', type: 'string', default: '' },
                  key: { title: 'Secret Key', type: 'string', default: '' }
                },
                required: ['env_var', 'name', 'key']
              },
              uihints: {
                items: {
                  env_var: { 'ui:placeholder': 'ENV_VAR' },
                  name: { 'ui:placeholder': 'secret-name' },
                  key: { 'ui:placeholder': 'secret-key' }
                }
              }
            },
            kubernetes_shared_mem_size: {
              title: 'Shared Memory Size',
              description:
                'Configure a custom shared memory size in gigabytes (10^9 bytes) for the pod that executes a node. A custom value is assigned if the size property value is a number greater than zero.',
              type: 'object',
              properties: {
                size: { title: 'Memory Size (GB)', type: 'integer', minimum: 0 }
              },
              required: [],
              uihints: { size: { 'ui:placeholder': 0 } }
            },
            kubernetes_tolerations: {
              title: 'Kubernetes Tolerations',
              description:
                'Kubernetes tolerations to apply to the pod where the node is executed.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  key: { title: 'Key', type: 'string', default: '' },
                  operator: {
                    title: 'Operator',
                    type: 'string',
                    default: 'Equal',
                    enum: ['Equal', 'Exists']
                  },
                  value: { title: 'Value', type: 'string', default: '' },
                  effect: {
                    title: 'Effect',
                    type: 'string',
                    default: '',
                    enum: ['', 'NoExecute', 'NoSchedule', 'PreferNoSchedule']
                  }
                },
                required: ['operator']
              },
              uihints: {
                items: {
                  key: { 'ui:placeholder': 'key' },
                  value: { 'ui:placeholder': 'value' },
                  effect: { 'ui:placeholder': 'NoSchedule' }
                }
              }
            },
            mounted_volumes: {
              title: 'Data Volumes',
              description:
                'Volumes to be mounted in this node. The specified Persistent Volume Claims must exist in the Kubernetes namespace where the node is executed or this node will not run.',
              type: 'array',
              default: [],
              items: {
                type: 'object',
                properties: {
                  path: { title: 'Mount Path', type: 'string', default: '' },
                  pvc_name: {
                    title: 'Persistent Volume Claim Name',
                    type: 'string',
                    default: ''
                  },
                  sub_path: { title: 'Sub Path', type: 'string', default: '' },
                  read_only: {
                    title: 'Mount volume read-only',
                    type: 'boolean',
                    default: false
                  }
                },
                required: ['path', 'pvc_name']
              },
              uihints: {
                items: {
                  path: { 'ui:placeholder': '/mount/path' },
                  pvc_name: { 'ui:placeholder': 'pvc-name' },
                  sub_path: { 'ui:placeholder': 'relative/path/within/volume' },
                  read_only: { 'ui:placeholder': ' ' }
                }
              }
            }
          },
          required: ['filename', 'runtime_image']
        }
      },
      required: ['component_parameters']
    };
  },
  '/elyra/pipeline/runtimes/types': () => {
    return {
      runtime_types: [
        {
          id: 'APACHE_AIRFLOW',
          display_name: 'Apache Airflow',
          icon: 'static/elyra/airflow.svg',
          export_file_types: [
            {
              id: 'py',
              display_name: 'Airflow domain-specific language Python code'
            }
          ]
        },
        {
          id: 'KUBEFLOW_PIPELINES',
          display_name: 'Kubeflow Pipelines',
          icon: 'static/elyra/kubeflow.svg',
          export_file_types: [
            {
              id: 'yaml',
              display_name: 'KFP static configuration file (YAML formatted)'
            },
            { id: 'py', display_name: 'Python DSL' }
          ]
        },
        {
          id: 'LOCAL',
          display_name: 'Local',
          icon: 'static/elyra/pipeline-flow.svg',
          export_file_types: []
        }
      ]
    };
  },
  '/elyra/schema/runtimes': () => {
    return {
      runtimes: [
        {
          $schema:
            'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/meta-schema.json',
          $id: 'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/airflow.json',
          title: 'Apache Airflow',
          name: 'airflow',
          schemaspace: 'runtimes',
          schemaspace_id: '130b8e00-de7c-4b32-b553-b4a52824a3b5',
          metadata_class_name:
            'elyra.pipeline.airflow.airflow_metadata.AirflowMetadata',
          runtime_type: 'APACHE_AIRFLOW',
          uihints: {
            title: 'Apache Airflow runtimes',
            icon: 'elyra:runtimes',
            reference_url:
              'https://elyra.readthedocs.io/en/v3.14.2/user_guide/runtime-conf.html'
          },
          properties: {
            schema_name: {
              title: 'Schema Name',
              description: 'The schema associated with this instance',
              type: 'string',
              const: 'airflow'
            },
            display_name: {
              title: 'Display Name',
              description: 'Display name of this Apache Airflow configuration',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: 'Additional data specific to this metadata',
              type: 'object',
              properties: {
                runtime_type: {
                  title: 'Runtime Type',
                  description: 'The runtime associated with this instance',
                  type: 'string',
                  const: 'APACHE_AIRFLOW',
                  uihints: { hidden: true }
                },
                description: {
                  title: 'Description',
                  description:
                    'Description of this Apache Airflow configuration',
                  type: 'string'
                },
                api_endpoint: {
                  title: 'Apache Airflow UI Endpoint',
                  description: 'The Apache Airflow UI endpoint',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Apache Airflow',
                    'ui:placeholder': 'https://your-airflow-webserver:port'
                  }
                },
                user_namespace: {
                  title: 'Apache Airflow User Namespace',
                  description:
                    'The Apache Airflow user namespace used to run DAG workflows',
                  type: 'string',
                  pattern: '^[a-z0-9][-a-z0-9]*[a-z0-9]$',
                  maxLength: 63,
                  default: 'default',
                  uihints: { category: 'Apache Airflow' }
                },
                git_type: {
                  title: 'Git type',
                  description: 'Git provider',
                  type: 'string',
                  enum: ['GITHUB'],
                  default: 'GITHUB',
                  uihints: { category: 'Apache Airflow' }
                },
                github_api_endpoint: {
                  title: 'GitHub or GitLab server API Endpoint',
                  description:
                    'The GitHub or GitLab server URL / API endpoint - Public or Enterprise',
                  type: 'string',
                  format: 'uri',
                  default: 'https://api.github.com',
                  uihints: {
                    category: 'Apache Airflow',
                    'ui:placeholder': 'https://your-github-or-gitlab-endpoint'
                  }
                },
                github_repo: {
                  title: 'GitHub or GitLab DAG Repository',
                  description: 'Existing repository where DAGs are stored',
                  type: 'string',
                  uihints: {
                    category: 'Apache Airflow',
                    'ui:placeholder': 'user-or-org/dag-repo-name'
                  }
                },
                github_branch: {
                  title: 'GitHub or GitLab DAG Repository Branch',
                  description:
                    'Existing branch in the repository where DAGs are stored',
                  type: 'string',
                  uihints: { category: 'Apache Airflow' }
                },
                github_repo_token: {
                  title: 'Personal Access Token',
                  description:
                    'Token that has permission to push to the DAG repository',
                  type: 'string',
                  uihints: {
                    'ui:field': 'password',
                    category: 'Apache Airflow'
                  }
                },
                cos_endpoint: {
                  title: 'Cloud Object Storage Endpoint',
                  description: 'The Cloud Object Storage endpoint',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Cloud Object Storage',
                    'ui:placeholder': 'https://your-cos-service:port'
                  }
                },
                public_cos_endpoint: {
                  title: 'Public Cloud Object Storage Endpoint',
                  description: 'The public Cloud Object Storage endpoint',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Cloud Object Storage',
                    'ui:placeholder': 'https://your-public-cos-endpoint:port'
                  }
                },
                cos_bucket: {
                  title: 'Cloud Object Storage Bucket Name',
                  description: 'The Cloud Object Storage bucket name',
                  type: 'string',
                  pattern: '^[a-z0-9][a-z0-9-.]*[a-z0-9]$',
                  minLength: 3,
                  maxLength: 222,
                  uihints: { category: 'Cloud Object Storage' }
                },
                cos_auth_type: {
                  title: 'Cloud Object Storage Authentication Type',
                  description:
                    'Authentication type Elyra uses to authenticate with Cloud Object Storage',
                  type: 'string',
                  enum: [
                    'AWS_IAM_ROLES_FOR_SERVICE_ACCOUNTS',
                    'KUBERNETES_SECRET',
                    'USER_CREDENTIALS'
                  ],
                  default: 'USER_CREDENTIALS',
                  uihints: { category: 'Cloud Object Storage' }
                },
                cos_secret: {
                  title: 'Cloud Object Storage Credentials Secret',
                  description:
                    "Kubernetes secret that's defined in the specified user namespace, containing the Cloud Object Storage username and password. This property is required for authentication type KUBERNETES_SECRET.",
                  type: 'string',
                  uihints: {
                    'ui:field': 'password',
                    category: 'Cloud Object Storage'
                  }
                },
                cos_username: {
                  title: 'Cloud Object Storage Username',
                  description:
                    'The Cloud Object Storage username. This property is required for authentication type USER_CREDENTIALS and KUBERNETES_SECRET.',
                  type: 'string',
                  uihints: { category: 'Cloud Object Storage' }
                },
                cos_password: {
                  title: 'Cloud Object Storage Password',
                  description:
                    'The Cloud Object Storage password. This property is required for authentication type USER_CREDENTIALS and KUBERNETES_SECRET.',
                  type: 'string',
                  minLength: 8,
                  uihints: {
                    'ui:field': 'password',
                    category: 'Cloud Object Storage'
                  }
                },
                tags: {
                  title: 'Tags',
                  description: 'Tags for categorizing Apache Airflow',
                  uniqueItems: true,
                  type: 'array',
                  items: { minLength: 1, pattern: '^[^ \t]+([ \t]+[^ \t]+)*$' },
                  uihints: { 'ui:field': 'tags' }
                }
              },
              required: [
                'api_endpoint',
                'cos_endpoint',
                'cos_auth_type',
                'cos_bucket',
                'github_api_endpoint',
                'github_branch',
                'github_repo_token',
                'github_repo'
              ]
            }
          },
          required: ['schema_name', 'display_name', 'metadata']
        },
        {
          $schema:
            'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/meta-schema.json',
          $id: 'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/kfp.json',
          title: 'Kubeflow Pipelines',
          name: 'kfp',
          schemaspace: 'runtimes',
          schemaspace_id: '130b8e00-de7c-4b32-b553-b4a52824a3b5',
          metadata_class_name: 'elyra.pipeline.kfp.kfp_metadata.KfpMetadata',
          runtime_type: 'KUBEFLOW_PIPELINES',
          uihints: {
            title: 'Kubeflow Pipelines runtimes',
            icon: 'elyra:runtimes',
            reference_url:
              'https://elyra.readthedocs.io/en/v3.14.2/user_guide/runtime-conf.html'
          },
          properties: {
            schema_name: {
              title: 'Schema Name',
              description: 'The schema associated with this instance',
              type: 'string',
              const: 'kfp'
            },
            display_name: {
              title: 'Display Name',
              description:
                'Display name of this Kubeflow Pipelines configuration',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: 'Additional data specific to this metadata',
              type: 'object',
              properties: {
                runtime_type: {
                  title: 'Runtime Type',
                  description: 'The runtime associated with this instance',
                  type: 'string',
                  const: 'KUBEFLOW_PIPELINES',
                  uihints: { hidden: true }
                },
                description: {
                  title: 'Description',
                  description:
                    'Description of this Kubeflow Pipelines configuration',
                  type: 'string'
                },
                api_endpoint: {
                  title: 'Kubeflow Pipelines API Endpoint',
                  description: 'The Kubeflow Pipelines API endpoint',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Kubeflow Pipelines',
                    'ui:placeholder':
                      'https://your-kubeflow-service:port/pipeline'
                  }
                },
                public_api_endpoint: {
                  title: 'Public Kubeflow Pipelines API Endpoint',
                  description: 'The public Kubeflow Pipelines API endpoint',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Kubeflow Pipelines',
                    'ui:placeholder':
                      'https://your-kubeflow-service:port/pipeline'
                  }
                },
                user_namespace: {
                  title: 'Kubeflow Pipelines User Namespace',
                  description:
                    'The Kubeflow Pipelines user namespace used to create experiments',
                  type: 'string',
                  pattern: '^[a-z0-9][-a-z0-9]*[a-z0-9]$',
                  maxLength: 63,
                  uihints: { category: 'Kubeflow Pipelines' }
                },
                engine: {
                  title: 'Kubeflow Pipelines engine',
                  description: 'The Kubeflow Pipelines engine in use',
                  type: 'string',
                  enum: ['Argo'],
                  default: 'Argo',
                  uihints: { category: 'Kubeflow Pipelines' }
                },
                auth_type: {
                  title: 'Authentication Type',
                  description:
                    'Authentication type Elyra uses to authenticate with Kubeflow',
                  type: 'string',
                  enum: [
                    'NO_AUTHENTICATION',
                    'KUBERNETES_SERVICE_ACCOUNT_TOKEN',
                    'DEX_STATIC_PASSWORDS',
                    'DEX_LDAP',
                    'DEX_LEGACY'
                  ],
                  default: 'NO_AUTHENTICATION',
                  uihints: { category: 'Kubeflow Pipelines' }
                },
                api_username: {
                  title: 'Kubeflow Pipelines API Endpoint Username',
                  description:
                    'The Kubeflow Pipelines API endpoint username. This property is required for all authentication types, except NO_AUTHENTICATION and KUBERNETES_SERVICE_ACCOUNT_TOKEN.',
                  type: 'string',
                  uihints: { category: 'Kubeflow Pipelines' }
                },
                api_password: {
                  title: 'Kubeflow Pipelines API Endpoint Password',
                  description:
                    'Password for the specified username. This property is required for all authentication types, except NO_AUTHENTICATION and KUBERNETES_SERVICE_ACCOUNT_TOKEN.',
                  type: 'string',
                  uihints: {
                    'ui:field': 'password',
                    category: 'Kubeflow Pipelines'
                  }
                },
                cos_endpoint: {
                  title: 'Cloud Object Storage Endpoint',
                  description: 'The Cloud Object Storage endpoint',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Cloud Object Storage',
                    'ui:placeholder': 'https://your-cos-service:port'
                  }
                },
                public_cos_endpoint: {
                  title: 'Public Cloud Object Storage Endpoint',
                  description: 'The public Cloud Object Storage endpoint',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Cloud Object Storage',
                    'ui:placeholder': 'https://your-public-cos-endpoint:port'
                  }
                },
                cos_bucket: {
                  title: 'Cloud Object Storage Bucket Name',
                  description: 'The Cloud Object Storage bucket name',
                  type: 'string',
                  pattern: '^[a-z0-9][a-z0-9-.]*[a-z0-9]$',
                  minLength: 3,
                  maxLength: 222,
                  uihints: { category: 'Cloud Object Storage' }
                },
                cos_auth_type: {
                  title: 'Cloud Object Storage Authentication Type',
                  description:
                    'Authentication type Elyra uses to authenticate with Cloud Object Storage',
                  type: 'string',
                  enum: [
                    'AWS_IAM_ROLES_FOR_SERVICE_ACCOUNTS',
                    'KUBERNETES_SECRET',
                    'USER_CREDENTIALS'
                  ],
                  default: 'USER_CREDENTIALS',
                  uihints: { category: 'Cloud Object Storage' }
                },
                cos_secret: {
                  title: 'Cloud Object Storage Credentials Secret',
                  description:
                    "Kubernetes secret that's defined in the specified user namespace, containing the Cloud Object Storage username and password. This property is required for authentication type KUBERNETES_SECRET.",
                  type: 'string',
                  uihints: {
                    'ui:field': 'password',
                    category: 'Cloud Object Storage'
                  }
                },
                cos_username: {
                  title: 'Cloud Object Storage Username',
                  description:
                    'The Cloud Object Storage username. This property is required for authentication type USER_CREDENTIALS and KUBERNETES_SECRET.',
                  type: 'string',
                  uihints: { category: 'Cloud Object Storage' }
                },
                cos_password: {
                  title: 'Cloud Object Storage Password',
                  description:
                    'The Cloud Object Storage password. This property is required for authentication type USER_CREDENTIALS and KUBERNETES_SECRET.',
                  type: 'string',
                  minLength: 8,
                  uihints: {
                    'ui:field': 'password',
                    category: 'Cloud Object Storage'
                  }
                },
                tags: {
                  title: 'Tags',
                  description: 'Tags for categorizing Kubeflow pipelines',
                  uniqueItems: true,
                  type: 'array',
                  items: { minLength: 1, pattern: '^[^ \t]+([ \t]+[^ \t]+)*$' },
                  uihints: { 'ui:field': 'tags' }
                }
              },
              required: [
                'api_endpoint',
                'cos_auth_type',
                'cos_endpoint',
                'cos_bucket'
              ]
            }
          },
          required: ['schema_name', 'display_name', 'metadata']
        }
      ]
    };
  },
  '/elyra/schema/runtime-images': () => {
    return {
      'runtime-images': [
        {
          $schema:
            'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/meta-schema.json',
          $id: 'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/runtime-image.json',
          title: 'Runtime Image',
          name: 'runtime-image',
          schemaspace: 'runtime-images',
          schemaspace_id: '119c9740-d73f-48c6-a97a-599d3acaf41d',
          uihints: {
            icon: 'elyra:container',
            title: 'Runtime Images',
            reference_url:
              'https://elyra.readthedocs.io/en/v3.14.2/user_guide/runtime-image-conf.html'
          },
          properties: {
            schema_name: {
              title: 'Schema Name',
              description: 'The schema associated with this instance',
              type: 'string',
              const: 'runtime-image'
            },
            display_name: {
              title: 'Display Name',
              description: 'The display name of the Runtime Image',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: 'Additional data specific to this Runtime Image',
              type: 'object',
              properties: {
                description: {
                  title: 'Description',
                  description: 'The description of this Runtime Image instance',
                  type: 'string'
                },
                tags: {
                  title: 'Tags',
                  description: 'Tags for categorizing runtime images',
                  uniqueItems: true,
                  type: 'array',
                  items: { minLength: 1, pattern: '^[^ \t]+([ \t]+[^ \t]+)*$' },
                  uihints: { 'ui:field': 'tags' }
                },
                image_name: {
                  title: 'Image Name',
                  description: 'The image name (including optional tag)',
                  type: 'string',
                  minLength: 1,
                  uihints: {
                    'ui:placeholder': 'registry/owner/image:tag',
                    category: 'Source'
                  }
                },
                pull_policy: {
                  title: 'Image Pull Policy',
                  description:
                    'The pull policy to use when selecting this image',
                  type: 'string',
                  enum: ['Always', 'IfNotPresent', 'Never'],
                  uihints: { category: 'Source' }
                },
                pull_secret: {
                  title: 'Image Pull Secret',
                  description:
                    'Kubernetes secret name containing the container registry credentials, if anonymous pull access is forbidden.',
                  type: 'string',
                  pattern: '^[a-z0-9][a-z0-9-.]*[a-z0-9]$',
                  maxLength: 253,
                  uihints: { category: 'Source', 'ui:field': 'password' }
                }
              },
              required: ['image_name']
            }
          },
          required: ['schema_name', 'display_name', 'metadata']
        }
      ]
    };
  },
  '/elyra/schema/component-catalogs': () => {
    return {
      'component-catalogs': [
        {
          $schema:
            'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/meta-schema.json',
          $id: 'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/pipeline/airflow/package_catalog_connector/airflow-package-catalog.json',
          title: 'Apache Airflow package operator catalog',
          name: 'airflow-package-catalog',
          schemaspace: 'component-catalogs',
          schemaspace_id: '8dc89ca3-4b90-41fd-adb9-9510ad346620',
          metadata_class_name:
            'elyra.pipeline.component_metadata.ComponentCatalogMetadata',
          uihints: {
            title: 'Apache Airflow core operator catalog',
            icon: '',
            reference_url:
              'https://github.com/elyra-ai/elyra/tree/main/elyra/pipeline/airflow/package_catalog_connector'
          },
          properties: {
            schema_name: {
              title: 'Schema Name',
              description: 'The schema associated with this instance',
              type: 'string',
              const: 'airflow-package-catalog'
            },
            display_name: {
              title: 'Display Name',
              description: 'Display name of this Component Catalog',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: 'Additional data specific to this metadata',
              type: 'object',
              properties: {
                description: {
                  title: 'Description',
                  description: 'Description of this Component Catalog',
                  type: 'string',
                  default: 'Airflow package operator catalog'
                },
                runtime_type: {
                  title: 'Runtime',
                  description: 'List of runtime types this catalog supports',
                  type: 'string',
                  enum: ['APACHE_AIRFLOW'],
                  default: 'APACHE_AIRFLOW'
                },
                categories: {
                  title: 'Category Names',
                  description:
                    'Assign the operators in the catalog to one or more categories, to group them in the visual pipeline editor palette.',
                  type: 'array',
                  items: { type: 'string', maxLength: 18 },
                  default: ['Core packages'],
                  uihints: { category: 'Component Categories' }
                },
                airflow_package_download_url: {
                  title: 'Airflow package download URL',
                  description:
                    'URL where the Apache Airflow package wheel can be downloaded',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Source',
                    'ui:placeholder':
                      'https://host:port/path/apache_airflow.whl'
                  }
                },
                search_contrib: {
                  title: 'Include operators in contrib package',
                  description:
                    'Include operators in package airflow.contrib.operators',
                  type: 'boolean',
                  uihints: { category: 'Source' }
                },
                auth_id: {
                  title: 'User Id',
                  description:
                    'User id that has read access for the specified URL resource',
                  type: 'string',
                  minLength: 1,
                  uihints: { category: 'Source credentials' }
                },
                auth_password: {
                  title: 'Password',
                  description: 'Password or API key for the specified user id',
                  type: 'string',
                  minLength: 1,
                  uihints: {
                    'ui:field': 'password',
                    category: 'Source credentials'
                  }
                }
              },
              required: ['runtime_type', 'airflow_package_download_url']
            }
          },
          required: ['schema_name', 'display_name', 'metadata']
        },
        {
          $schema:
            'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/meta-schema.json',
          $id: 'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/pipeline/airflow/provider_package_catalog_connector/airflow-provider-package-catalog.json',
          title: 'Apache Airflow provider package operator catalog',
          name: 'airflow-provider-package-catalog',
          schemaspace: 'component-catalogs',
          schemaspace_id: '8dc89ca3-4b90-41fd-adb9-9510ad346620',
          metadata_class_name:
            'elyra.pipeline.component_metadata.ComponentCatalogMetadata',
          uihints: {
            title: 'Apache Airflow provider package operator catalog',
            icon: '',
            reference_url:
              'https://github.com/elyra-ai/elyra/tree/main/elyra/pipeline/airflow/provider_package_catalog_connector'
          },
          properties: {
            schema_name: {
              title: 'Schema Name',
              description: 'The schema associated with this instance',
              type: 'string',
              const: 'airflow-provider-package-catalog'
            },
            display_name: {
              title: 'Display Name',
              description: 'Display name of this Component Catalog',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: 'Additional data specific to this metadata',
              type: 'object',
              properties: {
                description: {
                  title: 'Description',
                  description: 'Description of this Component Catalog',
                  type: 'string',
                  default: 'Apache Airflow provider package operator catalog'
                },
                runtime_type: {
                  title: 'Runtime',
                  description: 'List of runtime types this catalog supports',
                  type: 'string',
                  enum: ['APACHE_AIRFLOW'],
                  default: 'APACHE_AIRFLOW'
                },
                categories: {
                  title: 'Category Names',
                  description:
                    'Assign the operators in the catalog to one or more categories, to group them in the visual pipeline editor palette.',
                  type: 'array',
                  items: { type: 'string', maxLength: 18 },
                  default: ['provider packages'],
                  uihints: { category: 'Component Categories' }
                },
                airflow_provider_package_download_url: {
                  title: 'Provider package download URL',
                  description:
                    'URL where the Airflow provider package wheel can be downloaded.',
                  type: 'string',
                  format: 'uri',
                  uihints: {
                    category: 'Source',
                    'ui:placeholder':
                      'https://host:port/path/provider_package.whl'
                  }
                },
                auth_id: {
                  title: 'User Id',
                  description:
                    'User id that has read access for the specified URL resource',
                  type: 'string',
                  minLength: 1,
                  uihints: { category: 'Source credentials' }
                },
                auth_password: {
                  title: 'Password',
                  description: 'Password or API key for the specified user id',
                  type: 'string',
                  minLength: 1,
                  uihints: {
                    'ui:field': 'password',
                    category: 'Source credentials'
                  }
                }
              },
              required: [
                'runtime_type',
                'airflow_provider_package_download_url'
              ]
            }
          },
          required: ['schema_name', 'display_name', 'metadata']
        },
        {
          $schema:
            'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/meta-schema.json',
          $id: 'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/local-directory-catalog.json',
          title: 'Directory Component Catalog',
          name: 'local-directory-catalog',
          display_name: 'Directory Component Catalog',
          schemaspace: 'component-catalogs',
          schemaspace_id: '8dc89ca3-4b90-41fd-adb9-9510ad346620',
          metadata_class_name:
            'elyra.pipeline.component_metadata.DirectoryCatalogMetadata',
          uihints: {
            icon: '',
            reference_url:
              'https://elyra.readthedocs.io/en/v3.14.2/user_guide/pipeline-components.html#directory-component-catalog'
          },
          properties: {
            schema_name: {
              title: 'Schema Name',
              description: 'The schema associated with this instance',
              type: 'string',
              const: 'local-directory-catalog'
            },
            display_name: {
              title: 'Display Name',
              description: 'Display name of this Component Catalog',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: 'Additional data specific to this metadata',
              type: 'object',
              properties: {
                description: {
                  title: 'Description',
                  description: 'Description of this Component Catalog',
                  type: 'string'
                },
                runtime_type: {
                  title: 'Runtime Type',
                  description:
                    'The type of runtime associated with this Component Catalog',
                  type: 'string',
                  enum: ['KUBEFLOW_PIPELINES', 'APACHE_AIRFLOW'],
                  uihints: { category: 'Runtime' }
                },
                categories: {
                  title: 'Category Names',
                  description:
                    'Category names associated with this Component Catalog (the components defined in this registry will be organized in the component palette according to these categories)',
                  type: 'array',
                  items: { type: 'string', maxLength: 18 },
                  uihints: { category: 'Component Categories' }
                },
                paths: {
                  title: 'Directories',
                  description:
                    'A list of paths to directories in the local filesystem that each contain one or more component specification files',
                  type: 'array',
                  items: { type: 'string' },
                  uihints: { category: 'Configuration' }
                },
                include_subdirs: {
                  title: 'Include Subdirectories',
                  description:
                    'Indicates whether a recursive search for component specification files should be performed on subdirectories',
                  type: 'boolean',
                  uihints: { category: 'Configuration' }
                }
              },
              required: ['runtime_type', 'paths']
            }
          },
          required: ['schema_name', 'display_name', 'metadata']
        },
        {
          $schema:
            'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/meta-schema.json',
          $id: 'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/local-file-catalog.json',
          title: 'Filesystem Component Catalog',
          name: 'local-file-catalog',
          display_name: 'Filesystem Component Catalog',
          schemaspace: 'component-catalogs',
          schemaspace_id: '8dc89ca3-4b90-41fd-adb9-9510ad346620',
          metadata_class_name:
            'elyra.pipeline.component_metadata.FilenameCatalogMetadata',
          uihints: {
            icon: '',
            reference_url:
              'https://elyra.readthedocs.io/en/v3.14.2/user_guide/pipeline-components.html#filesystem-component-catalog'
          },
          properties: {
            schema_name: {
              title: 'Schema Name',
              description: 'The schema associated with this instance',
              type: 'string',
              const: 'local-file-catalog'
            },
            display_name: {
              title: 'Display Name',
              description: 'Display name of this Component Catalog',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: 'Additional data specific to this metadata',
              type: 'object',
              properties: {
                description: {
                  title: 'Description',
                  description: 'Description of this Component Catalog',
                  type: 'string'
                },
                runtime_type: {
                  title: 'Runtime Type',
                  description:
                    'The type of runtime associated with this Component Catalog',
                  type: 'string',
                  enum: ['KUBEFLOW_PIPELINES', 'APACHE_AIRFLOW'],
                  uihints: { category: 'Runtime' }
                },
                categories: {
                  title: 'Category Names',
                  description:
                    'Category names associated with this Component Catalog (the components defined in this registry will be organized in the component palette according to these categories)',
                  type: 'array',
                  items: { type: 'string', maxLength: 18 },
                  uihints: { category: 'Component Categories' }
                },
                base_path: {
                  title: 'Optional Base Directory',
                  description:
                    'An optional base directory from which the given values of Paths can be resolved',
                  type: 'string',
                  uihints: { category: 'Configuration' }
                },
                paths: {
                  title: 'Paths',
                  description:
                    'A list of paths to individual component specification files in the local filesystem',
                  type: 'array',
                  items: { type: 'string' },
                  uihints: { category: 'Configuration' }
                }
              },
              required: ['runtime_type', 'paths']
            }
          },
          required: ['schema_name', 'display_name', 'metadata']
        },
        {
          $schema:
            'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/meta-schema.json',
          $id: 'https://raw.githubusercontent.com/elyra-ai/elyra/main/elyra/metadata/schemas/url-catalog.json',
          title: 'URL Component Catalog',
          name: 'url-catalog',
          display_name: 'URL Component Catalog',
          schemaspace: 'component-catalogs',
          schemaspace_id: '8dc89ca3-4b90-41fd-adb9-9510ad346620',
          metadata_class_name:
            'elyra.pipeline.component_metadata.UrlCatalogMetadata',
          uihints: {
            icon: '',
            reference_url:
              'https://elyra.readthedocs.io/en/v3.14.2/user_guide/pipeline-components.html#url-component-catalog'
          },
          properties: {
            schema_name: {
              title: 'Schema Name',
              description: 'The schema associated with this instance',
              type: 'string',
              const: 'url-catalog'
            },
            display_name: {
              title: 'Display Name',
              description: 'Display name of this Component Catalog',
              type: 'string',
              minLength: 1
            },
            metadata: {
              description: 'Additional data specific to this metadata',
              type: 'object',
              properties: {
                description: {
                  title: 'Description',
                  description: 'Description of this Component Catalog',
                  type: 'string'
                },
                runtime_type: {
                  title: 'Runtime Type',
                  description:
                    'The type of runtime associated with this Component Catalog',
                  type: 'string',
                  enum: ['KUBEFLOW_PIPELINES', 'APACHE_AIRFLOW'],
                  uihints: { category: 'Runtime' }
                },
                categories: {
                  title: 'Category Names',
                  description:
                    'Category names associated with this Component Catalog (the components defined in this registry will be organized in the component palette according to these categories)',
                  type: 'array',
                  items: { type: 'string', maxLength: 18 },
                  uihints: { category: 'Component Categories' }
                },
                paths: {
                  title: 'URLs',
                  description:
                    'A list of URLs to individual component specification files',
                  type: 'array',
                  items: { type: 'string', format: 'uri' },
                  uihints: {
                    category: 'Configuration',
                    items: {
                      'ui:placeholder': 'https://host:port/path/component_file'
                    }
                  }
                },
                auth_id: {
                  title: 'User Id',
                  description:
                    'User id that has read access for the specified URL resources',
                  type: 'string',
                  minLength: 1,
                  uihints: { category: 'Source credentials' }
                },
                auth_password: {
                  title: 'Password',
                  description: 'Password or API key for the specified user id',
                  type: 'string',
                  minLength: 1,
                  uihints: {
                    'ui:field': 'password',
                    category: 'Source credentials'
                  }
                }
              },
              required: ['runtime_type', 'paths']
            }
          },
          required: ['schema_name', 'display_name', 'metadata']
        }
      ]
    };
  }
};
