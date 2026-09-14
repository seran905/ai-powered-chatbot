import concurrently from 'concurrently';

concurrently([
    {
        name: 'client',
        command: 'bun run dev',
        cwd: './packages/client',
        prefixColor: 'green'
    },
    {
        name: 'server',
        command: 'bun run dev',
        cwd: './packages/server',
        prefixColor: 'cyan'
    }
]);