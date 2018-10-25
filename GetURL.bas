Attribute VB_Name = "Module1"
Function GetURL(rng As Range) As String
     On Error Resume Next
     GetURL = rng.Hyperlinks(1).Address
End Function
