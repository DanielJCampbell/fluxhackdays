module Id exposing (..)

type alias Id = Int
type alias HasId = { id: Id }

updateIf: (a -> Bool) -> (a -> a) -> a -> a
updateIf check func elem =
  case (check elem) of
    True ->
      func elem
    False ->
      elem

updateWithId: List a -> (a -> HasId) -> Id -> (a -> a) -> List a
updateWithId collection toHasId idToUpdate updateFunc =
  let
    hasId = (\id elem -> (.id (toHasId elem)) == id)
  in
    List.map (updateIf (hasId idToUpdate) updateFunc) collection
