module Character exposing (..)

import Id exposing (Id)
import Field exposing (Field)

type alias Character = {
  name: String,
  fields: List Field,
  allowedActions: List Id
}