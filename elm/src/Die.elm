module Die exposing (..)

import Random

import Id exposing (..)

type alias Die = {
  id: Id,
  faces: Int,
  roll: Int
}

toGen: Die -> Random.Generator Int
toGen die =
  Random.int 1 (.faces die)

-- LIST METHODS

setRoll: List Die -> Id -> Int -> List Die
setRoll dice idToReplace newRoll =
  let
    updateRoll = (\val die -> { die | roll = val }) newRoll
  in
    Id.updateWithId dice toHasId idToReplace updateRoll

toHasId: Die -> HasId
toHasId die =
  HasId (.id die)
