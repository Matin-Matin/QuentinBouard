Add-Type -AssemblyName System.Drawing

function Optimize-Image {
    param(
        [string]$ImagePath,
        [int]$MaxWidth = 2560,
        [int]$Quality = 95
    )
    
    try {
        $image = [System.Drawing.Image]::FromFile($ImagePath)
        $originalWidth = $image.Width
        $originalHeight = $image.Height
        
        # Calculer les nouvelles dimensions si l'image est trop grande
        $newWidth = $originalWidth
        $newHeight = $originalHeight
        
        if ($originalWidth -gt $MaxWidth) {
            $ratio = $MaxWidth / $originalWidth
            $newWidth = $MaxWidth
            $newHeight = [int]($originalHeight * $ratio)
        }
        
        # Créer une nouvelle image redimensionnée
        $newImage = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
        $graphics = [System.Drawing.Graphics]::FromImage($newImage)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        
        $graphics.DrawImage($image, 0, 0, $newWidth, $newHeight)
        
        # Sauvegarder avec compression
        $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)
        
        $extension = [System.IO.Path]::GetExtension($ImagePath).ToLower()
        $tempPath = $ImagePath + ".tmp"
        
        if ($extension -eq ".png") {
            # Pour les PNG, convertir en JPEG seulement si très lourd (>10MB)
            $fileInfo = Get-Item $ImagePath
            if ($fileInfo.Length -gt 10MB) {
                $newPath = $ImagePath -replace '\.png$', '.jpg'
                $newImage.Save($newPath, $encoder, $encoderParams)
                $image.Dispose()
                $newImage.Dispose()
                $graphics.Dispose()
                Remove-Item $ImagePath -Force
                Write-Host "Converti et optimisé: $ImagePath -> $newPath (PNG vers JPG - fichier très lourd)"
                return $newPath
            } else {
                $newImage.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
            }
        } else {
            $newImage.Save($tempPath, $encoder, $encoderParams)
        }
        
        $image.Dispose()
        $newImage.Dispose()
        $graphics.Dispose()
        
        # Remplacer l'original
        Remove-Item $ImagePath -Force
        Move-Item $tempPath $ImagePath -Force
        
        Write-Host "Optimisé: $ImagePath"
        return $ImagePath
        
    } catch {
        Write-Host "Erreur avec $ImagePath : $_" -ForegroundColor Red
        return $null
    }
}

# Optimiser toutes les images
$images = Get-ChildItem -Path ".\images" -Recurse -Include *.jpg,*.jpeg,*.png,*.JPG,*.JPEG,*.PNG

$totalBefore = 0
$totalAfter = 0
$convertedFiles = @()

foreach ($img in $images) {
    $sizeBefore = $img.Length
    $totalBefore += $sizeBefore
    
    $result = Optimize-Image -ImagePath $img.FullName -MaxWidth 2560 -Quality 95
    
    if ($result -ne $null) {
        if ($result -ne $img.FullName) {
            $convertedFiles += @{Original = $img.FullName; New = $result}
        }
        $sizeAfter = (Get-Item $result).Length
        $totalAfter += $sizeAfter
        $reduction = [math]::Round((($sizeBefore - $sizeAfter) / $sizeBefore) * 100, 2)
        Write-Host "  Réduction: $reduction%" -ForegroundColor Green
    }
}

Write-Host "`n=== RÉSUMÉ ===" -ForegroundColor Cyan
Write-Host "Taille totale avant: $([math]::Round($totalBefore/1MB, 2)) MB"
Write-Host "Taille totale après: $([math]::Round($totalAfter/1MB, 2)) MB"
Write-Host "Réduction totale: $([math]::Round((($totalBefore - $totalAfter) / $totalBefore) * 100, 2))%"

if ($convertedFiles.Count -gt 0) {
    Write-Host "`nFichiers convertis de PNG vers JPG:" -ForegroundColor Yellow
    foreach ($file in $convertedFiles) {
        Write-Host "  $($file.Original) -> $($file.New)"
    }
}
