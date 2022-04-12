$tickflow = (Get-Item '*.tickflow').Basename
echo $tickflow
foreach($file in $tickflow){
    tickompiler c $file'.tickflow' bin\
}
tickompiler p bin\ ..\code.bin
mv -force C00.bin $Env:APPDATA\Citra\sdmc\rhmm