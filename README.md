# minml 
[![minml](https://circleci.com/gh/texodus/minml.svg?style=svg)](https://circleci.com/gh/texodus/minml)


A programming language experiment, to explore the idea of a strong, statically-typed
language, which does not require *any* explicit type annotations.  And [Tetris](https://texodus.github.io/minml).

There is only a rudimentary scope-checker presently implemented, but the semantics are
designed for simple ML-style HM, plus [Polymorphic Variants](http://caml.inria.fr/pub/papers/garrigue-polymorphic_variants-ml98.pdf), and [Structural Types](https://caml.inria.fr/pub/papers/garrigue-structural_poly-fool02.pdf).  Still undecided on many details of how this may
work - e.g. how parametric polyphorism is inferred (I am interested in [FreezeML](https://arxiv.org/abs/2004.00396)'s approach as it may provide some flexibility via syntax rather
than explicit types).

The compiler supports a Javascript backend, and has been _bootstrapped_ (e.g.
the source code of the minml compiler is written in minml), but should be
straightforward to re-implement for WASM if the type semantics have been formalized.

### Tutorial

minml is syntactically from the SML/OCAML/Haskell/F# family, and supports simple 
`let` bindings, first-class functions, and a simple `module`/namespacing system, in a
manner that should be familiar to functional programmers.  It is white-space significant
ala Haskell and F# `#light` syntax.

Variables are immutable and introduced via `let`

```fsharp
let x = 1
```

First-class functions simply use `->` (no keyword), and traditional compound let/lambda
shorthand syntax is supported.

```fsharp
let f = x -> x + 1
let g x y = (x + y) / 2
```

Basic primitive types (`Int`, `Float`, `String`, `Bool`), plus `List` (brackets) and
`Tuple` (braces) types.

```fsharp
let animals = ["cat", "dog", "fox"]
let account = {"Liz's Account", 1234.56, true}
```

Polymorphic variants are constructed with Capitalized symbols, and are always single
argument data constructors.

```fsharp
let animal2 = Cat "Garfield"
let animal1 = Dog "Odie"

let cons_list = Cons {1, Cons {2, Nil {}}}
```

Simple pattern matching is supported in all symbol binding positions.

```fsharp
let {x, y} = {1, 2}
let (Cat name) = Cat "Nermal"
```

.. but pattern matching is unified with function syntax using the `|` operator,
like a match statement without the `match` keyword (though `match!` macro is a available
in the default namespace).

```fsharp
let list_length =
    | Cons x -> 1 + list_length x
    | Nil {} -> 0
```

Code can be organized in logical, strucurally typed units with the `module` keyword,
and imported from other files via `use`.  They can also be nested!

```fsharp
module math =

    let add x y = x + y
    let div x y = x / y

let x = math.add 1 2

use map
let my_map = map.from_array [{"Key1", 1}, {"Key2", 2}]
```

Macros are just regular functions;  modules are the smallest unit of code compiled
incrementally, so any definition in a module can be used as a macro, as long as it
is of type `Statement -> Statement`, the Polymorphic Variant data structure which
represents minml's AST.  Macros are invoked with `!`, and subsequent macro 
arguments are delimited with `:`.  

Some other macros.  

```fsharp
// `if!`
let is_it_four x =
    if! x == 4 then:
        sys.log "It's 4!"
    else:
        sys.log "It's not 4!"

// `match!`
let head x = match! x with:
    | Cons {x, xs} -> x
    | Nil -> sys.fail "Don't write unsafe functions!"

// `str.str!`
let msg x = str.str!
    "This is an interpolated string, for example " x 
    " is a variable and " (x + 4) " is four more than that!"

// `js!` 
js! "console.log(" (msg 4) ")"

// `array.matrix!`
let identity3 = array.matrix!
    1 0 0
    0 1 0
    0 0 1

// `call_later!`
call_later! sys.log "I am called second!"
sys.log "I am called first!"
```

The special macros `quote!` and `unquote!` can be used to create the AST datastructure
inline, for easy macro definitions

```fsharp
let call_later f = quote! js! "setTimeout(() => " (unquote! f) ")"
```

The `test` module comes with a simple macro-based assertion suite which executes at
compile time.

```fsharp
test.assert! list_length cons_list == 2
test.assert! head cons_list == 1 
```

### IDE

This repo is also a VS Code plugin which enables minml syntax highlighting; it can
either be installed as a standard plugin, or executed via the included `launch.json`.

### Development

minml is _bootstrapped_, and requires a copy of a previous version of itself to
compile itself;  hence, `minml` is included in its own `devDependencies`.  To build,
first run `yarn build` to build the compiler from the old compiler, then `yarn boot`
to compile with the previously-compiled compiler.  `yarn unboot` will reset your local
`dist` directory to the `devDependencies` version, in the event your compiler-compiled
compiler no longer compiles the compiler.

### Old Repo

This project re-uses a name from a different, Haskell-based toy language which varies
considerably from present.  I honestly just really liked the name and wanted to re-use
it;  the old repository has been moved to
[texodus/minml-old](https://github.com/texodus/minml-old).