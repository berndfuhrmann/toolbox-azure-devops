@{
  Rules = @{
    PSUseConsistentIndentation   = @{
      Enable          = $true
      IndentationSize = 2
      Kind            = 'space'
    }
    PSUseConsistentWhitespace    = @{
      Enable                          = $true
      CheckInnerBrace                 = $true
      CheckOpenBrace                  = $true
      CheckOpenParen                  = $true
      CheckOperator                   = $true
      CheckPipe                       = $true
      CheckPipeForRedundantWhitespace = $false
      CheckSeparator                  = $true
      CheckParameter                  = $false
    }
    PSAlignAssignmentStatement   = @{
      Enable = $false
    }
  }
}
