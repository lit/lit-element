# polymer-benchmarks

A collection of benchmarks related to Polymer Project libraries.

For the runner used by these benchmarks, see
[tachometer](https://github.com/PolymerLabs/tachometer/)

## Setup

```sh
git clone git@github.com:PolymerLabs/benchmarks.git
cd benchmarks/
npm install
```

## Shack

Shack is a simplified subset of the
[Polymer Shop](https://github.com/Polymer/shop) demo app, implemented for
benchmarking purposes using lit-html, LitElement, and Polymer 3. To compare the
first-contentful-paint time for each of these implementations, run:

```sh
npx tach --config shack.json
```
