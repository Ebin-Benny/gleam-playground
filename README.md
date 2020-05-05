# Gleam Playground

An interactive playground for the Gleam graphics library.

## Features

Interactive playground with an editor and viewer. Uses GHCi to interpret and run the playground on top of the project.

## Requirements

The workspace should contain a Cabal or Stack project 
* Cabal - <https://www.haskell.org/cabal/download.html>
* Stack - <https://docs.haskellstack.org/en/stable/README/>

The project must be a Gleam project; it must include Gleam in the dependencies. <https://hackage.haskell.org/package/Gleam>

## Usage

1. Run the playground using the status bar button.
2. Enter expressions in the playground to be on the result view.
    * To show a canvas on the page, use a `play` statement or redefine the main of the program.
    * To show multiple canvases on the mage, use multiple `play` statements.
  
## Known Issues

If the result view does not show, run the playground again.


## Release Notes

### 1.0.0

Initial release of the Gleam Playground.
