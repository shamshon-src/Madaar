$ErrorActionPreference = 'Stop'
$taskNode = (Get-Command node -ErrorAction Stop).Source
$taskServices = @(
    @{ Port = 5600; Path = 'server'; Health = 'http://127.0.0.1:5600/Main.html' }
)
foreach ($taskService in $taskServices) {
    try {
        $taskResponse = Invoke-WebRequest -Uri $taskService.Health -UseBasicParsing -TimeoutSec 2
        if ($taskResponse.StatusCode -eq 200) { continue }
    } catch {}
    $taskDirectory = Join-Path $PSScriptRoot $taskService.Path
    Start-Process -FilePath $taskNode -ArgumentList 'server.cjs' -WorkingDirectory $taskDirectory -WindowStyle Hidden | Out-Null
}
Write-Output 'Open http://127.0.0.1:5600/Main.html'
