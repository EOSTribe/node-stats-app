#!/bin/bash

node app.js  > stdout.txt 2> stderr.txt & echo $! > app.pid
