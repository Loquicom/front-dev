const fs = require('fs');
const zip = require('bestzip');
const del = require('del');
const copydir = require('copy-dir');
const chokidar = require('chokidar');
const portfinder = require('portfinder');
const { spawn, exec } = require('child_process');
const { program } = require('commander');

program.version('1.0.0');
program
    .option('--css <path>', 'Destination of CSS files compiled from SCSS files', 'src/css/')
    .option('-p, --port <number>', 'Change the port to use', 8000)
    .option('-z, --zip [output]', 'zip the source files');
program.parse(process.argv);

// Package application
if (program.zip) {
    const output = (program.zip === true) ? 'out' : program.zip;
    package(output);
} 
// Start web server with hot reload for scss
else {
    portfinder.basePort = program.port;
    portfinder.getPort((err, port) => {
        if (err) {
            console.log(`Unable to start the server: ${err}`)
            return;
        }
        start(port, program.css);
    });
}

function start(port, cssOutput) {
    // Run web server
    const serv = spawn('http-server', ['./src/', '-p', port, '-o', './', '-c-1']);
    console.log(`Server start on http://localhost:${port}`);
    // Run watcher
    chokidar.watch('./src/').on('all', (event, path) => {
        const split = path.split('/');
        const file = split[split.length - 1];
        // If it's a scss file
        if (file.endsWith('.scss') && file[0] !== '_') {
            const dest = cssOutput + file.replace('.scss', '.min.css');
            // Compile
            exec(`node-sass --output-style compressed ${path} ${dest}`, (error, stdout, stderr) => {
                if (error) {
                  console.error(`Unable to compile: ${path}`);
                  return;
                }
                console.log(`Compiled ${path} to ${dest}`);
            });
        }
    });
    // Ctrl+C
    process.on('SIGINT', function() {
        serv.kill();
        console.log('\nServer stop');
        process.exit();
    });
}

async function package(output) {
    if(!output.endsWith('.zip')) {
        output += '.zip';
    }

    // Del existing zip file
    if (fs.existsSync(`./${output}`)) {
        await del([`./${output}`])
    }

    //TODO Compile SCSS files

    // Copy file to zip
    copydir.sync('./src/', './output/', {
        utimes: true,
        mode: true, 
        cover: true
    });

    // Del useless files
    //await del(['./norauto-maintenance/css/scss/'])

    // Zip
    zip({
        source: ['./output/'],
        destination: `./${output}`
    }).then(async function() {
        await del(['./output/'])
        console.log('Package success');
    }).catch(function(err) {
        console.log('Package fail');
        console.error(err.stack);
        process.exit(1);
    });
}

//TODO Method to compile SCSS in src