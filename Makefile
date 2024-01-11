build: llama-update llama-build pull-models

llama-update:
	git submodule update --remote

llama-build:
	$(MAKE) -C ./llama.cpp/ llava-cli server

pull-models:
	mkdir -p models/llava
	wget -P models/llava https://huggingface.co/mys/ggml_llava-v1.5-7b/resolve/main/ggml-model-q4_k.gguf 
	wget -P models/llava https://huggingface.co/mys/ggml_llava-v1.5-7b/resolve/main/mmproj-model-f16.gguf

run-server:
	./llama.cpp/server \
		--threads 4 \
		--threads-batch 4 \
		--ctx-size 512 \
		--batch-size 512 \
		--n-gpu-layers 0 \
		--host 0.0.0.0 \
		--model models/llava/ggml-model-q4_k.gguf \
		--mmproj models/llava/mmproj-model-f16.gguf \

run-cli:
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
