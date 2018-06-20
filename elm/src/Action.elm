module Action exposing (..)

import Random
import Maybe
import Result

import Id exposing (..)
import Die exposing (Die)
import DiceGroup exposing (DiceGroup)

type alias Action = {
  id: Id,
  diceGroups: List DiceGroup,
  name: String,
  description: String
}

toGen: Action -> Random.Generator(Int)
toGen action =
  let
    groupGens = List.map DiceGroup.toGen (.diceGroups action)
  in
    List.foldr (\groupGen actionGen -> Random.map2 (+) groupGen actionGen) (Random.int 0 0) groupGens

toStr: Action -> String
toStr action =
  (.name action) ++ ": " ++ (.description action)

toHasId: Action -> HasId
toHasId action =
  HasId (.id action)
