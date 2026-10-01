# Convertit le cahier de relecture (HTML) en vrai document Word (.docx).
#
# Word est piloté en automatisation (COM) : il ouvre le HTML, applique la mise
# en page A4 + marges + pied de page numéroté, puis enregistre en .docx.
#
# Prérequis : Microsoft Word installé. Usage :  powershell -File creer-docx.ps1

$ErrorActionPreference = 'Stop'

# Word expose sa bibliotheque de types en anglais : sans cette bascule de culture,
# PowerShell echoue avec « Error loading type library/DLL » sur un Windows en francais.
[System.Threading.Thread]::CurrentThread.CurrentCulture =
    [System.Globalization.CultureInfo]::GetCultureInfo('en-US')

$dossier = Split-Path -Parent $MyInvocation.MyCommand.Path
$html    = Join-Path $dossier 'cahier-relecture-psy2a.html'
$docx    = Join-Path $dossier 'Cahier-de-relecture-PSY2A.docx'

if (-not (Test-Path $html)) { throw "Fichier introuvable : $html (lancez d'abord : node generer-cahier.mjs)" }
if (Test-Path $docx) { Remove-Item $docx -Force }

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

try {
    $doc = $word.Documents.Open($html, [ref]$false, [ref]$false)

    # --- Mise en page : A4, marges resserrées pour laisser de la place aux cases ---
    $ps = $doc.PageSetup
    $ps.PageWidth    = $word.CentimetersToPoints(21.0)
    $ps.PageHeight   = $word.CentimetersToPoints(29.7)
    $ps.TopMargin    = $word.CentimetersToPoints(1.6)
    $ps.BottomMargin = $word.CentimetersToPoints(1.6)
    $ps.LeftMargin   = $word.CentimetersToPoints(1.5)
    $ps.RightMargin  = $word.CentimetersToPoints(1.5)

    # --- Pied de page : titre à gauche, numéro de page à droite ---
    $footer = $doc.Sections.Item(1).Footers.Item(1).Range   # 1 = wdHeaderFooterPrimary
    $footer.Text = "Cahier de relecture PSY2A`tPage "
    $footer.Collapse(0) | Out-Null                          # 0 = wdCollapseEnd
    $doc.Fields.Add($footer, 33) | Out-Null                 # 33 = wdFieldPage
    $fr = $doc.Sections.Item(1).Footers.Item(1).Range
    $fr.Font.Size = 8
    $fr.Font.Color = 8421504                                # gris

    # --- Tableaux : en-tête répété, largeurs de colonnes identiques partout ---
    # (l'import HTML de Word redimensionne sinon chaque tableau selon son contenu)
    $cm = { param($v) $word.CentimetersToPoints($v) }
    $largeurs = @((& $cm 1.7), (& $cm 9.2), (& $cm 7.1))   # total 18 cm = largeur utile

    foreach ($t in $doc.Tables) {
        $t.Rows.Item(1).HeadingFormat = $true
        $t.Rows.AllowBreakAcrossPages = $false
        $t.Range.ParagraphFormat.SpaceAfter = 2
        $t.AllowAutoFit = $false
        foreach ($row in $t.Rows) {
            # Les lignes de titre de section n'ont qu'une cellule fusionnée : on les saute.
            if ($row.Cells.Count -ne 3) { continue }
            for ($c = 1; $c -le 3; $c++) { $row.Cells.Item($c).Width = $largeurs[$c - 1] }
        }
    }

    # Format 16 = wdFormatXMLDocument (.docx)
    $doc.SaveAs2($docx, 16)
    $pages = $doc.ComputeStatistics(2)                      # 2 = wdStatisticPages
    $doc.Close($false)
    Write-Output "OK : $docx ($pages pages)"
}
finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
