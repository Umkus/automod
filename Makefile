update:
	git pull
	git submodule init
	git submodule update --remote

build:
	$(MAKE) -C ./llama.cpp/ llama-llava-cli llama-llava-server

model-obsidian-3b:
	mkdir -p models/obsidian/3b
	wget -O models/obsidian/3b/ggml-model-q4_k.gguf https://huggingface.co/NousResearch/Obsidian-3B-V0.5-GGUF/resolve/main/obsidian-q6.gguf
	wget -O models/obsidian/3b/mmproj-model-f16.gguf https://huggingface.co/NousResearch/Obsidian-3B-V0.5-GGUF/resolve/main/mmproj-obsidian-f16.gguf

model-llava-7b:
	mkdir -p models/llava/7b
	wget -O models/llava/7b/ggml-model-q4_k.gguf https://huggingface.co/mys/ggml_llava-v1.5-7b/resolve/main/ggml-model-q4_k.gguf 
	wget -O models/llava/7b/mmproj-model-f16.gguf https://huggingface.co/mys/ggml_llava-v1.5-7b/resolve/main/mmproj-model-f16.gguf

model-llava-7b-1.6:
	mkdir -p models/llava/7b-1.6
	wget -O models/llava/7b-1.6/ggml-model-q4_k.gguf https://huggingface.co/cjpais/llava-1.6-mistral-7b-gguf/resolve/main/llava-v1.6-mistral-7b.Q4_K_M.gguf
	wget -O models/llava/7b-1.6/mmproj-model-f16.gguf https://huggingface.co/cjpais/llava-1.6-mistral-7b-gguf/resolve/main/mmproj-model-f16.gguf

model-llava-34b:
	mkdir -p models/llava/34b
	wget -O models/llava/34b/ggml-model-q4_k.gguf https://huggingface.co/cjpais/llava-v1.6-34B-gguf/resolve/main/llava-1.6-34b.Q3_K.gguf
	wget -O models/llava/34b/mmproj-model-f16.gguf https://huggingface.co/cjpais/llava-v1.6-34B-gguf/resolve/main/mmproj-model-f16.gguf

model-llava-13b:
	mkdir -p models/llava/13b
	wget -O models/llava/13b/ggml-model-q4_k.gguf https://huggingface.co/mys/ggml_llava-v1.5-13b/resolve/main/ggml-model-q4_k.gguf
	wget -O models/llava/13b/mmproj-model-f16.gguf https://huggingface.co/mys/ggml_llava-v1.5-13b/resolve/main/mmproj-model-f16.gguf

model-llava-13b-1.6:
	mkdir -p models/llava/13b-1.6
	wget -O models/llava/13b-1.6/ggml-model-q4_k.gguf https://huggingface.co/cmp-nct/llava-1.6-gguf/resolve/main/vicuna-13b-q6_k.gguf
	wget -O models/llava/13b-1.6/mmproj-model-f16.gguf https://huggingface.co/cmp-nct/llava-1.6-gguf/resolve/main/vicuna-13b-mmproj-model-f16-q6_k.gguf

model-moondream:
	mkdir -p models/moondream2
	wget -O models/moondream2/moondream2-text-model-f16.gguf https://huggingface.co/vikhyatk/moondream2/resolve/main/moondream2-text-model-f16.gguf
	wget -O models/moondream2/moondream2-mmproj-f16.gguf https://huggingface.co/vikhyatk/moondream2/resolve/main/moondream2-mmproj-f16.gguf

model-bunny:
	mkdir -p models/bunny
	wget -O models/bunny/bunny-text-model-f16.gguf https://huggingface.co/BAAI/Bunny-v1_0-4B-gguf/resolve/main/ggml-model-Q4_K_M.gguf
	wget -O models/bunny/bunny-mmproj-f16.gguf https://huggingface.co/BAAI/Bunny-v1_0-4B-gguf/resolve/main/mmproj-model-f16.gguf

# docker run -p 8080:8080 -v `pwd`/models:/models ghcr.io/ggerganov/llama.cpp:server
server:
	./llama.cpp/llama-server \
		-ngl 0 \
		--threads 16 \
		--threads-batch 16 \
		--ctx-size 512 \
		--batch-size 512 \
		--host 0.0.0.0 \
		--model models/bunny/bunny-text-model-f16.gguf \
		--mmproj models/bunny/bunny-mmproj-f16.gguf \

cli:
	./llama.cpp/llama-llava-cli \
		--threads 16 \
		--threads-batch 16 \
		--ctx-size 512 \
		--batch-size 512 \
		--top-k 20 \
		--top-p 0.33 \
		--min-p 0.05 \
		--temp 0.1 \
		--prompt "describe" \
		-ngl 0 \
		-ngld 0 \
		--model models/bunny/bunny-text-model-f16.gguf \
		--mmproj models/bunny/bunny-mmproj-f16.gguf \
		--grammar-file ./grammar.gbnf \
		--image images/m-2.jpeg \
