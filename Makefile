update:
	git submodule init
	git submodule update --remote

build:
	$(MAKE) -C ./llama.cpp/ llava-cli server


model-llava-7b:
	mkdir -p models/llava/7b
	wget -O models/llava/7b/ggml-model-q4_k.gguf https://huggingface.co/mys/ggml_llava-v1.5-7b/resolve/main/ggml-model-q4_k.gguf 
	wget -O models/llava/7b/mmproj-model-f16.gguf https://huggingface.co/mys/ggml_llava-v1.5-7b/resolve/main/mmproj-model-f16.gguf

model-llava-13b:
	mkdir -p models/llava/13b
	wget -O models/llava/13b/ggml-model-q4_k.gguf https://huggingface.co/mys/ggml_llava-v1.5-13b/resolve/main/ggml-model-q4_k.gguf
	wget -O models/llava/13b/mmproj-model-f16.gguf https://huggingface.co/mys/ggml_llava-v1.5-13b/resolve/main/mmproj-model-f16.gguf

server:
	./llama.cpp/server \
		--threads 16 \
		--threads-batch 16 \
		--ctx-size 512 \
		--batch-size 512 \
		--host 0.0.0.0 \
		--model models/llava/7b/ggml-model-q4_k.gguf \
		--mmproj models/llava/7b/mmproj-model-f16.gguf \

cli:
	./llama.cpp/llava-cli \
		--threads 8 \
		--threads-batch 8 \
		--ctx-size 512 \
		--batch-size 512 \
		--top-k 40 \
		--top-p 0.9 \
		--min-p 0.1 \
		--file prompt.txt \
		--model models/llava/7b/ggml-model-q4_k.gguf \
		--mmproj models/llava/7b/mmproj-model-f16.gguf \
		--image images/m-2.jpeg \
		--temp 0.1
