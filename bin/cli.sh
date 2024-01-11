#!/bin/bash

cd "$(dirname "$0")"/..

./llama.cpp/llava-cli \
    --threads 8 \
    --threads-batch 8 \
    --ctx-size 512 \
    --batch-size 512 \
    --top-k 40 \
    --top-p 0.9 \
    --min-p 0.1 \
    --n-gpu-layers 0 \
    --n-gpu-layers-draft 0 \
    --file prompt.txt \
    --model models/llava/ggml-model-q4_k.gguf \
    --mmproj models/llava/mmproj-model-f16.gguf \
    --image images/m-2.jpeg \
    --temp 0.1
