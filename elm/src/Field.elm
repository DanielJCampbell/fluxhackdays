module Field exposing (..)

type alias Field = {
  name: String,
  value: FieldValue
}

type FieldValue = FInt Int | FString String | FBool Bool