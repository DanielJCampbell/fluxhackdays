module Token exposing (..)

import Image exposing (Image)
import Position exposing (Position)

type alias Token = {
  pos: Position,
  img: Image
}