Revaluate.js lets you re-evaluate JavaScript code within its original execution
context without causing unwanted side-effects.

It does this by compile time meta-programming, give it the content and filename
of a script and it will compile consecutive updates of that script for you which
can be evaluated with `eval` or other means of code execution.

The code transformation does the following things:

* Functions expressions and declarations are proxied,
on consecutive runs the inner target function will be replaced.

* Call expressions are memoized on their first run, on consecutive runs the
memoized value will be yielded.

## Install

```console
npm install revaluate
```

## LICENSE

MIT
