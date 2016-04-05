#!/usr/bin/env /usr/local/bin/node

const bitbar = require('bitbar');

bitbar([
    {
        text: '❤',
        color: bitbar.darkMode ? 'white' : 'red',
        dropdown: false
    },
    bitbar.sep,
    {
        text: 'Unicorns',
        color: '#ff79d7',
        href: 'https://www.youtube.com/watch?v=9auOCbH5Ns4'
    },
    bitbar.sep,
    'Ponies'
]);
