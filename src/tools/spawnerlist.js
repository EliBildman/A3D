export const spawners = [
    {
        name: 'Util',
        events: [
            {
                name: 'OnExpired',
            },
        ],
        actions: [
            {
                name: 'print',
                connections_allowed: true,
                arrows: {},
            },
            {
                name: 'if',
                connections_allowed: false,
                arrows: {
                    true: {
                        name: 'True',
                    },
                    false: {
                        name: 'False',
                    },
                },
            },
            {
                name: 'bar',
                connections_allowed: true,
                arrows: {},
            },
        ],
    },
    {
        name: 'TPPlug',
        events: [],
        actions: [
            {
                name: 'on',
                connections_allowed: true,
                arrows: {},
            },
            {
                name: 'off',
                connections_allowed: true,
                arrows: {},
            },
            {
                name: 'save',
                connections_allowed: true,
                arrows: {},
            },
        ],
        color: 'pink',
    },
    {
        name: 'TPLight',
        events: [
            {
                name: 'biz',
                connections_allowed: true,
                arrows: {},
            },
        ],
        actions: [
            {
                name: 'foo',
                connections_allowed: true,
                arrows: {},
            },
            {
                name: 'bar',
                connections_allowed: true,
                arrows: {},
            },
        ],
        color: 'pink',
    },
    {
        name: 'Clock',
        events: [
            {
                name: 'biz',
                connections_allowed: true,
                arrows: {},
            },
        ],
        actions: [
            {
                name: 'foo',
                connections_allowed: true,
                arrows: {},
            },
            {
                name: 'bar',
                connections_allowed: true,
                arrows: {},
            },
        ],
        color: 'pink',
    },
    {
        name: 'MotionSensor',
        events: [
            {
                name: 'biz',
                connections_allowed: true,
                arrows: {},
            },
        ],
        actions: [
            {
                name: 'foo',
                connections_allowed: true,
                arrows: {},
            },
            {
                name: 'bar',
                connections_allowed: true,
                arrows: {},
            },
        ],
        color: 'pink',
    },
    {
        name: 'Thermostat',
        events: [
            {
                name: 'biz',
                connections_allowed: true,
                arrows: {},
            },
        ],
        actions: [
            {
                name: 'foo',
                connections_allowed: true,
                arrows: {},
            },
            {
                name: 'bar',
                connections_allowed: true,
                arrows: {},
            },
        ],
        color: 'pink',
    },
];
