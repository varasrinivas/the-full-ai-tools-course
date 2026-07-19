<#
Deploy 10x-toolkit.html to the learning.varasrinivas.com S3 bucket.

Usage:
  .\deploy.ps1                                          # defaults + deploy.config.json if present
  .\deploy.ps1 -Bucket my-bucket -AwsProfile personal -DistributionId E123ABC
  .\deploy.ps1 -DryRun                                  # print the aws commands, run nothing

Secrets policy: this script contains NO credentials. AWS auth comes from your
local AWS CLI config (aws configure / aws sso login). Per-machine overrides
(profile, CloudFront distribution id) belong in deploy.config.json, which is
gitignored — copy deploy.config.example.json to start.
#>
param(
  [string]$Bucket,
  [string]$AwsProfile,
  [string]$DistributionId,
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$file = Join-Path $root '10x-toolkit.html'

# precedence: built-in default < deploy.config.json < command-line parameter
$config = @{ Bucket = 'learning.varasrinivas.com'; AwsProfile = ''; DistributionId = '' }
$configPath = Join-Path $root 'deploy.config.json'
if (Test-Path $configPath) {
  $json = Get-Content $configPath -Raw | ConvertFrom-Json
  foreach ($k in 'Bucket','AwsProfile','DistributionId') {
    if ($json.PSObject.Properties[$k] -and $json.$k) { $config[$k] = $json.$k }
  }
}
if ($Bucket) { $config.Bucket = $Bucket }
if ($AwsProfile) { $config.AwsProfile = $AwsProfile }
if ($DistributionId) { $config.DistributionId = $DistributionId }

if (-not (Test-Path $file)) { throw '10x-toolkit.html not found next to deploy.ps1' }
if (-not $DryRun) {
  if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
    throw "AWS CLI not found. Install it, then run 'aws configure' (or 'aws sso login') first."
  }
}

$profileArgs = @()
if ($config.AwsProfile) { $profileArgs = @('--profile', $config.AwsProfile) }

# upload the player twice: canonical name + index.html so the bare domain resolves
foreach ($key in @('10x-toolkit.html', 'index.html')) {
  $awsArgs = @('s3','cp',$file,"s3://$($config.Bucket)/$key",
            '--cache-control','no-cache',
            '--content-type','text/html; charset=utf-8') + $profileArgs
  if ($DryRun) { Write-Host "DRY RUN: aws $($awsArgs -join ' ')" }
  else {
    aws @awsArgs
    if ($LASTEXITCODE -ne 0) { throw "Upload of $key failed (exit $LASTEXITCODE)" }
  }
}

if ($config.DistributionId) {
  $awsArgs = @('cloudfront','create-invalidation',
            '--distribution-id',$config.DistributionId,
            '--paths','/','/index.html','/10x-toolkit.html') + $profileArgs
  if ($DryRun) { Write-Host "DRY RUN: aws $($awsArgs -join ' ')" }
  else {
    aws @awsArgs | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "CloudFront invalidation failed (exit $LASTEXITCODE)" }
    Write-Host "CloudFront invalidation created for $($config.DistributionId)"
  }
} else {
  Write-Host 'No DistributionId configured - skipped CloudFront invalidation.'
}

if (-not $DryRun) {
  Write-Host "Deployed 10x-toolkit.html (+ index.html copy) to s3://$($config.Bucket)/"
}
