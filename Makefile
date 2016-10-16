PATH ?= $(npm bin):$(PATH)
NODE ?= node
TEST ?= $(wildcard test/*.js)

test : $(addsuffix .test, $(basename $(TEST)))
	@echo "Success, all tests passed."

%.test : %.js
	@$(NODE) $<

.PHONY : test %.test
