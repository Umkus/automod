#!/bin/bash

cd "$(dirname "$0")"/..

../llama.cpp/server \
    --threads 4 \
    --threads-batch 4 \
    --ctx-size 512 \
    --batch-size 512 \
    --n-gpu-layers 0 \
    --host 0.0.0.0 \
    --model models/llava/ggml-model-q4_k.gguf \
    --mmproj models/llava/mmproj-model-f16.gguf \
