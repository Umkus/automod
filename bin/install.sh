#!/bin/bash

cd "$(dirname "$0")"/..

git clone https://github.com/ggerganov/llama.cpp.git

cd llama.cpp
make llava-cli server
chmod +x llava-cli server

cd ..

mkdir -p models/llava
cd models/llava

wget https://huggingface.co/mys/ggml_llava-v1.5-7b/resolve/main/ggml-model-q4_k.gguf 
wget https://huggingface.co/mys/ggml_llava-v1.5-7b/resolve/main/mmproj-model-f16.gguf
