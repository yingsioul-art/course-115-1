/* 生物統計 R 語法逐行教學（實習課 01：R 入門／讀檔／描述統計／作圖；實習課 02：機率分布）
   依賴：tools_bio.js 的 window.RRUN.runR（webR） */
window.TOOLS = window.TOOLS || {};
(function () {
  const R = String.raw;

  // ---------- 課程內容 ----------
  const LESSONS = [
    // ================= 實習課 01（9/10）=================
    {
      id: "A1", group: "01", icon: "🧮", title: "R 基本運算與 RStudio 操作", lec: ["bio_lab1", 20],
      goal: "會在 RStudio 執行程式，並用 R 做加減乘除、整除、餘數、四捨五入、開根號。",
      blocks: [
        { type: "html", html: `
          <p><b>RStudio 四個窗格</b>（講義第 15 頁）：左上 <b>Script</b> 寫程式、左下 <b>Console</b> 看結果、右上 <b>Environment</b> 看已經存了哪些東西、右下 <b>Files／Plots／Packages／Help</b>。</p>
          <p><b>怎麼執行</b>（第 19 頁）：在 Script 裡按 Enter <b>只會換行</b>；要執行請把游標放在那一行（或反白一段），按 <b>Ctrl + Enter</b>（Mac：Cmd + Enter）或右上角的 Run。直接在 Console 打字則按 Enter 就執行。</p>
          <p>這個練習區的「執行」按鈕，等於把整段一次送進 Console。</p>` },
        { type: "code", code: R`1*1     # 相乘
1/2     # 相除
5%/%2   # 取商數
5%%2    # 取餘數
round(1.46553, digits = 0)  # 四捨五入，取小數後 0 位
round(1.46553, digits = 1)  # 四捨五入，取小數後 1 位
25**2   # 平方
sqrt(81)  # 開根號
log(2, base = exp(1))
exp(1)
abs(-5)   # 絕對值`, notes: [
          "乘法用 <code>*</code>（不是 ×）。結果 1。",
          "除法用 <code>/</code>。結果 0.5。",
          "<code>%/%</code>＝整除，只留商數：5 ÷ 2 ＝ 2 餘 1，所以結果是 <b>2</b>。",
          "<code>%%</code>＝取餘數：結果是 <b>1</b>。臨床例子：「50 小時裡每 8 小時給藥，給了幾次、剩幾小時」就用這兩個。",
          "<code>round(數字, digits = 位數)</code>。結果 1。",
          "結果 1.5。",
          "次方可以寫 <code>**</code> 或 <code>^</code>，<code>25^2</code> 也是 625。",
          "開根號：9。",
          "以 e 為底的對數，就是自然對數 ln 2 ≈ 0.693。只寫 <code>log(2)</code> 預設也是以 e 為底。",
          "e 的 1 次方 ≈ 2.718。",
          "絕對值：5。",
        ] },
        { type: "table", head: ["符號／函數", "意思", "例子 → 結果"], rows: [
          ["<code>+ - * /</code>", "加減乘除", "<code>7 / 2</code> → 3.5"],
          ["<code>^</code> 或 <code>**</code>", "次方", "<code>2^3</code> → 8"],
          ["<code>%/%</code>", "整除（商）", "<code>7 %/% 2</code> → 3"],
          ["<code>%%</code>", "餘數", "<code>7 %% 2</code> → 1"],
          ["<code>round(x, digits = n)</code>", "四捨五入到小數第 n 位", "<code>round(3.14159, 2)</code> → 3.14"],
          ["<code>sqrt(x)</code>", "開根號", "<code>sqrt(16)</code> → 4"],
          ["<code>log(x)</code>／<code>exp(x)</code>", "自然對數／e 的次方", "<code>log(exp(2))</code> → 2"],
          ["<code>abs(x)</code>", "絕對值", "<code>abs(-3)</code> → 3"],
          ["<code>rm(list = ls())</code>", "清空所有已存的東西（每支程式開頭常見）", ""],
          ["<code>?函數名稱</code>", "打開說明文件", "<code>?round</code>"],
        ] },
        { type: "try", title: "試試看：把數字換掉",
          task: "把數字換成你想算的，例如 <code>17 %/% 5</code>、<code>17 %% 5</code>、<code>round(2.675, 2)</code>，按執行看結果。",
          starter: R`17 %/% 5
17 %% 5
round(65 / 1.6^2, 1)
sqrt(2)` },
        { type: "try", title: "動手寫：給藥次數",
          task: "每 <b>8 小時</b>給藥一次，住院 <b>50 小時</b>。算出「給了幾個完整的間隔」存到 <code>doses</code>，「最後剩幾小時」存到 <code>left</code>。",
          starter: R`doses <-
left <-
doses
left`,
          check: R`isTRUE(doses == 6) && isTRUE(left == 2)`,
          hint: "商數用 %/%，餘數用 %%。",
          answer: R`doses <- 50 %/% 8
left <- 50 %% 8
doses
left` },
        { type: "try", title: "動手寫：算 BMI",
          task: "體重 65 公斤、身高 160 公分。BMI＝體重 ÷ 身高（公尺）²，四捨五入到小數第 1 位，存到 <code>bmi</code>。",
          starter: R`bmi <-
bmi`,
          check: R`isTRUE(all.equal(bmi, 25.4))`,
          hint: "身高要換成公尺 1.6；平方用 ^2；最外面包 round( , 1)。",
          answer: R`bmi <- round(65 / 1.6^2, 1)
bmi` },
        { type: "q", ids: ["b44", "b45", "b14"] },
      ],
    },
    {
      id: "A2", group: "01", icon: "🏷️", title: "指定變數與資料型態", lec: ["bio_lab1", 21],
      goal: "知道變數怎麼取名、哪些寫法會錯，並分得出 numeric、character、logical 等型態。",
      blocks: [
        { type: "code", code: R`rm(list=ls())
s<-90
v<-20+70
S<-10
sv<-1+2+3
5s<-90
x<-10
sum<-90
sum(x,v)
?sum
z1<-c(10,20,30)
z2<-c(男,女)
Z3<-c("男","女")
z4<-c("10","20","30")
z5<-c(10,"男")
class(z1)
length(z1)`, notes: [
          "清空 Environment 裡所有已存的東西，讓程式從乾淨狀態開始。",
          "把 90 存進 s。<code>&lt;-</code> 左右空格可有可無，<code>s &lt;- 90</code> 比較好讀。",
          "右邊先算好（90）再存進 v。",
          "<b>大寫 S 和小寫 s 是兩個不同的變數</b>。",
          "變數名稱可以有多個字母。",
          "❌ <b>會出錯</b>：變數名稱不能以數字開頭。",
          "把 10 存進 x。",
          "⚠️ 不會出錯，但<b>不建議</b>：sum 本來是「加總」函數的名字，拿來當變數會讓人（和自己）搞混。",
          "結果仍是 30：R 看到後面有括號，會跳過同名的變數去找函數。能跑不代表好讀，所以取名要避開函數名稱。",
          "問號＋函數名稱：打開說明文件，看這個函數怎麼用。",
          "numeric（數值）向量。",
          "❌ <b>會出錯</b>：男、女沒有加引號，R 會把它們當成變數名稱去找，找不到就報錯。",
          "✅ 文字要加引號 → character（文字）向量。",
          "數字加了引號就變成文字，不能拿來計算。",
          "數字和文字混在一起時，<b>全部會被轉成文字</b>（10 變成 \"10\"）。",
          "查型態：numeric。",
          "查長度（有幾個值）：3。",
        ], copyNote: "原稿故意放了會出錯的示範行（5s、c(男,女)），執行到那裡就會停下來。看完錯誤訊息後，把那一行刪掉或在最前面加 # 變成註解，再執行一次。" },
        { type: "table", head: ["型態", "說明", "例子"], rows: [
          ["numeric", "數值（整數或小數）", "<code>c(36.5, 37.2)</code>"],
          ["character", "文字，要加引號", "<code>c(\"Nursing\", \"pharmacy\")</code>"],
          ["logical", "是／否：TRUE、FALSE（全大寫）", "<code>c(TRUE, FALSE)</code>"],
          ["factor", "類別變項，有固定的幾個類別（levels）", "<code>as.factor(d1$depart)</code>"],
          ["vector", "同型態的一排值", "<code>c(1, 2, 3)</code>"],
          ["data.frame", "資料表：每一欄可以是不同型態（像 Excel）", "讀檔進來的 d1"],
          ["matrix／array", "同型態的二維／多維表格", ""],
          ["list", "什麼都能裝的收納盒", ""],
        ] },
        { type: "html", html: `<p><b>取名規則</b>（第 21 頁）：①第一個字必須是英文字母 ②大小寫不同就是不同名稱（S ≠ s、TRUE ≠ True）③單引號和雙引號都可以包文字 ④避免和 R 已有的函數同名（sum、mean、c、data）。</p>` },
        { type: "try", title: "試試看：猜型態",
          task: "先猜每一行的 class 是什麼，再按執行對答案。",
          starter: R`class(36.5)
class("36.5")
class(TRUE)
class(c(1, "a"))
class(c(1, TRUE))
x <- c(35, 42, 58)
x >= 40`, },
        { type: "try", title: "動手寫：病人名單",
          task: "建立 3 位病人的姓名向量 <code>name</code>（文字，隨你取）、年齡向量 <code>age</code>（數字）；再建立 <code>is_old</code>，判斷每位是否 65 歲以上。",
          starter: R`name <-
age <-
is_old <-
is_old`,
          check: R`is.character(name) && length(name) == 3 && is.numeric(age) && length(age) == 3 && is.logical(is_old) && all(is_old == (age >= 65))`,
          hint: "文字要加引號；「大於等於」寫成 >=，結果會是 TRUE／FALSE。",
          answer: R`name <- c("王小明", "陳美玲", "林大同")
age <- c(72, 58, 65)
is_old <- age >= 65
is_old` },
        { type: "q", ids: ["b46", "b17", "b15", "b40"] },
      ],
    },
    {
      id: "A3", group: "01", icon: "📂", title: "讀取檔案（txt、csv、Excel）", lec: ["bio_lab1", 23],
      goal: "知道「工作資料夾」是什麼，會用 read.table、read.csv、read_xlsx 把資料讀成 data.frame。",
      blocks: [
        { type: "html", html: `
          <p><b>工作資料夾</b>就像 R 目前站著的那個病歷櫃：只寫檔名時，R 只會在這個櫃子裡找。所以要嘛把 R 檔和資料檔放在同一個資料夾，要嘛用 <code>setwd()</code> 告訴 R 去哪裡找。</p>
          <p>這個練習區的工作資料夾已經放好 <code>scores.txt</code>、<code>scores.csv</code>、<code>scores.xlsx</code>、<code>bmi.txt</code>、<code>bmi.csv</code>、<code>bmi.xlsx</code>。</p>` },
        { type: "code", code: R`getwd()
setwd("C:\\Users\\USER\\Desktop\\ABIO_Topic_01")
setwd("C:/Users/USER/Desktop/ABIO_Topic_01")
d1<-read.table("scores.txt",header=T)
d2<-read.csv("scores.csv",header=T)
d1=read.table("C:\\Users\\USER\\Desktop\\ABIO_Topic_01\\scores.txt",header=T)
d1=read.table(file.choose(),header=T)
install.packages("readxl")
library("readxl")
d3<-read_xlsx("scores.xlsx")`, notes: [
          "get working directory：顯示目前的工作資料夾。",
          "set working directory：換到放資料的資料夾。Windows 路徑的反斜線要寫<b>兩條</b> <code>\\\\</code>……",
          "……或改成<b>正斜線</b> <code>/</code>。只寫一條 <code>\\</code> 會出錯。（這兩行在瀏覽器版不能執行，因為沒有你電腦上的資料夾。）",
          "<b>方法一</b>：讀 txt。<code>header = T</code>（T 就是 TRUE）表示第一列是欄位名稱。txt 預設用空白或 Tab 分隔欄位。",
          "讀 csv（逗號分隔）。read.csv 的 header 預設就是 TRUE，可以省略。",
          "<b>方法二</b>：不設工作資料夾，直接寫完整路徑。這裡用 <code>=</code> 存結果，效果和 <code>&lt;-</code> 一樣。",
          "<b>方法三</b>：跳出視窗讓你點選檔案（只能在 RStudio 用，瀏覽器版不行）。<b>方法四</b>是 Environment 視窗的 Import Dataset，用滑鼠操作。",
          "讀 Excel 要用套件 readxl。套件<b>只需要安裝一次</b>。",
          "<b>每次重新開啟 R 都要</b>用 library() 載入套件才能用。",
          "讀 Excel 檔。",
        ], copyNote: "原稿裡的 setwd()、完整路徑和 file.choose() 只能在自己電腦的 RStudio 執行；在這裡會停在 setwd 那行。想在這裡跑，請把那幾行前面加 #。" },
        { type: "table", head: ["檔案", "函數", "要注意"], rows: [
          [".txt", "<code>read.table(\"檔名\", header = TRUE)</code>", "header 預設是 FALSE，一定要寫；分隔符號用 <code>sep</code> 指定（例如 <code>sep = \"\\t\"</code>）"],
          [".csv", "<code>read.csv(\"檔名\")</code>", "逗號分隔；header 預設 TRUE"],
          [".xlsx", "<code>read_xlsx(\"檔名\")</code>", "要先 <code>install.packages(\"readxl\")</code>（一次）＋ <code>library(readxl)</code>（每次）"],
        ] },
        { type: "try", title: "試試看：三種讀法",
          task: "直接執行，比較三個讀進來的資料長得一不一樣。仔細看 txt 版的系名：它寫成 <code>PublicHealth</code>（沒有空格），csv 版是 <code>Public Health</code>。",
          starter: R`getwd()
list.files()
d1 <- read.table("scores.txt", header = TRUE)
head(d1)
d2 <- read.csv("scores.csv")
head(d2)
install.packages("readxl")
library(readxl)
d3 <- read_xlsx("scores.xlsx")
head(d3)
table(d1$depart)
table(d2$depart)` },
        { type: "try", title: "試試看：忘了 header 會怎樣？",
          task: "執行後看第一列：欄位名稱被當成資料了，而且 R 自己取了 V1、V2 當欄名。",
          starter: R`bad <- read.table("scores.txt")
head(bad)` },
        { type: "try", title: "動手寫：讀 BMI 資料",
          task: "把 <code>bmi.csv</code> 讀進來存成 <code>b</code>，再用 <code>dim()</code> 看有幾列幾欄。",
          starter: R`b <-
dim(b)`,
          check: R`is.data.frame(b) && nrow(b) == 129 && "BMI" %in% names(b)`,
          hint: "csv 用 read.csv(\"檔名\")，檔名要加引號。",
          answer: R`b <- read.csv("bmi.csv")
dim(b)` },
        { type: "try", title: "動手寫：讀 Excel",
          task: "用 readxl 讀 <code>bmi.xlsx</code>，存成 <code>b3</code>，印出前六筆。",
          starter: R`library(readxl)
b3 <-
head(b3)`,
          check: R`exists("b3") && nrow(b3) == 129 && "BMI" %in% names(b3)`,
          hint: "read_xlsx(\"bmi.xlsx\")。如果出現找不到函數，先執行 install.packages(\"readxl\")。",
          answer: R`install.packages("readxl")
library(readxl)
b3 <- read_xlsx("bmi.xlsx")
head(b3)` },
        { type: "q", ids: ["b47", "b48", "b16"] },
      ],
    },
    {
      id: "A4", group: "01", icon: "📈", title: "描述性統計", lec: ["bio_lab1", 32],
      goal: "會看資料的樣子（head、dim、str），會用 $ 取出一欄，並算出平均、中位數、變異數、標準差、四分位數、眾數。",
      blocks: [
        { type: "code", code: R`rm(list=ls())
library("readxl")
d1<-read_xlsx("scores.xlsx")
head(d1)
tail(d1)
dim(d1)
colnames(d1)
str(d1)
d1$depart=as.factor(d1$depart)
levels(d1$depart)
table(d1$depart)
mean(d1$scores)
median(d1$scores)
var(d1$scores)
sd(d1$scores)
quantile(d1$scores)
min(d1$scores)
max(d1$scores)
range(d1$scores)
names(table(d1$scores))[which.max(table(d1$scores))]
max(table(d1$scores))
summary(d1$scores)`, notes: [
          "清空環境。",
          "載入 readxl（假設已經安裝過）。",
          "讀 Excel，存成 d1。",
          "看前 6 筆。",
          "看後 6 筆。",
          "資料大小：129 列（人）、2 欄（變項）。",
          "欄位名稱：depart、scores。",
          "每一欄的型態：depart 是文字（chr），scores 是數字。",
          "<b><code>d1$depart</code>＝d1 裡叫 depart 的那一欄</b>。這行把它從文字轉成 factor（類別變項），再存回原來那一欄。",
          "列出有哪些類別（系所）。",
          "每個類別各有幾人。",
          "平均數。",
          "中位數。",
          "<b>樣本</b>變異數（分母 n−1）。",
          "<b>樣本</b>標準差＝√變異數。",
          "四分位數：0%（最小）、25%（Q1）、50%（中位數）、75%（Q3）、100%（最大）。",
          "最小值。",
          "最大值。",
          "同時給最小和最大。",
          "<b>眾數</b>：R 沒有內建眾數函數，要自己組。下方有零件拆解。",
          "眾數出現了幾次。",
          "一次給六個數：最小、Q1、中位數、平均、Q3、最大。",
        ] },
        { type: "parts", code: R`names(table(d1$scores))[which.max(table(d1$scores))]`, parts: [
          ["d1$scores", "①取出成績那一欄。"],
          ["table( )", "②數每個分數各出現幾次，例如 59 分出現 5 次。"],
          ["which.max( )", "③找出次數最多的是「第幾個」位置。"],
          ["names( )", "④table 的名字就是分數本身，取出所有名字。"],
          ["[ ]", "⑤用第③步的位置，從名字裡挑出那一個 → 就是眾數。結果是文字（帶引號），因為名字都是文字。"],
        ] },
        { type: "html", html: `<p><b>讀法訣竅：</b>遇到一長串的程式，<b>從最裡面的括號往外讀</b>，一層一層拆。</p>` },
        { type: "try", title: "試試看：跑一遍描述統計",
          task: "直接執行，對照每一行的結果。再試著把 <code>scores</code> 換成打錯的 <code>Scores</code>，看看會發生什麼。",
          starter: R`d1 <- read.csv("scores.csv")
str(d1)
d1$depart <- as.factor(d1$depart)
table(d1$depart)
mean(d1$scores)
sd(d1$scores)
quantile(d1$scores)
summary(d1$scores)` },
        { type: "try", title: "動手寫：平均與標準差",
          task: "讀 <code>scores.csv</code> 存成 <code>d</code>，把成績的平均存到 <code>avg</code>、標準差存到 <code>s</code>。",
          starter: R`d <- read.csv("scores.csv")
avg <-
s <-
avg
s`,
          check: R`isTRUE(all.equal(avg, mean(read.csv("scores.csv")$scores))) && isTRUE(all.equal(s, sd(read.csv("scores.csv")$scores)))`,
          hint: "成績那一欄是 d$scores；函數是 mean() 和 sd()。",
          answer: R`d <- read.csv("scores.csv")
avg <- mean(d$scores)
s <- sd(d$scores)
avg
s` },
        { type: "try", title: "動手寫：護理系有幾人",
          task: "算出系所是 <code>Nursing</code> 的人數，存到 <code>n_nurse</code>。",
          starter: R`d <- read.csv("scores.csv")
n_nurse <-
n_nurse`,
          check: R`isTRUE(as.numeric(n_nurse) == sum(read.csv("scores.csv")$depart == "Nursing"))`,
          hint: "先 table(d$depart)，再用中括號取出 [\"Nursing\"]。",
          answer: R`d <- read.csv("scores.csv")
n_nurse <- table(d$depart)["Nursing"]
n_nurse` },
        { type: "try", title: "動手寫：四分位距 IQR",
          task: "算成績的四分位距（Q3 − Q1），存到 <code>iqr</code>。",
          starter: R`d <- read.csv("scores.csv")
q <- quantile(d$scores)
q
iqr <-
iqr`,
          check: R`isTRUE(all.equal(as.numeric(iqr), as.numeric(quantile(read.csv("scores.csv")$scores)[4] - quantile(read.csv("scores.csv")$scores)[2])))`,
          hint: "q 的第 4 個是 75%（Q3）、第 2 個是 25%（Q1）：q[4] - q[2]。也可以直接用 IQR(d$scores)。",
          answer: R`d <- read.csv("scores.csv")
q <- quantile(d$scores)
iqr <- q[4] - q[2]
iqr
IQR(d$scores)   # 內建函數，結果相同` },
        { type: "q", ids: ["b49", "b50", "b51", "b52"] },
      ],
    },
    {
      id: "A5", group: "01", icon: "🎨", title: "作圖：直方圖、盒形圖、長條圖、圓餅圖", lec: ["bio_lab1", 35],
      goal: "會畫四種基本圖，並用 main、xlab、ylab、xlim、ylim、col、breaks 調整外觀。",
      blocks: [
        { type: "code", code: R`library("readxl")
par(pty="s")
d1<-read_xlsx("scores.xlsx")
hist(d1$scores)
hist(d1$scores, main="Histogram of Scores", xlab="Score", ylab="Frequency",
     xlim=c(0,100), ylim=c(0,40), col="navajowhite", border="navajowhite3", breaks=10)
boxplot(d1$scores, main="Box plot of Scores", ylab="Score", col="aquamarine", lty=1, lwd=1)
d1$depart=as.factor(d1$depart)
depart.t=table(d1$depart)
barplot(depart.t, main="Number of Students by Department", xlab="Department",
        ylab="Number of Students", ylim=c(0,60), col=c("#F6B6D2","#F6B6D2","#EE91BA","#E568A4","#D9438C","#B52D70"), cex.names=0.5)
pie(depart.t, main="Distribution of Students by Department",
    col=c("#B7DFFF","#88CFFF","#44B5FF","#168BE8","#0066B5","#004478"))`, notes: [
          "載入 readxl，才能用 read_xlsx()。",
          "把畫圖區設成正方形（pty＝plot type，s＝square）。",
          "讀資料。",
          "最陽春的直方圖：只給資料，其他都用預設。",
          "美化版直方圖：標題、x／y 軸名稱……",
          "……x 軸範圍 0～100、y 軸範圍 0～40、填色、邊框色、<code>breaks</code> 大約分成幾組。<code>c(下界, 上界)</code> 用來給範圍。",
          "盒形圖：<code>lty</code>＝線條樣式（1 是實線）、<code>lwd</code>＝線條粗細。",
          "長條圖要的是「各組次數」，所以先把系所轉成類別……",
          "……再用 table() 算好各系人數。變數名稱可以有點（depart.t）。",
          "<b>barplot 放的是次數表，不是原始資料</b>。",
          "<code>col</code> 給 6 個顏色，依序套在 6 根長條上（色碼 # 開頭）；<code>cex.names</code>＝類別字的大小（0.5＝一半）。",
          "圓餅圖一樣放次數表。",
          "",
        ] },
        { type: "table", head: ["參數", "意思", "例子"], rows: [
          ["<code>main</code>", "圖標題", "<code>main = \"成績分布\"</code>"],
          ["<code>xlab</code>／<code>ylab</code>", "x／y 軸名稱", "<code>xlab = \"分數\"</code>"],
          ["<code>xlim</code>／<code>ylim</code>", "座標軸範圍", "<code>ylim = c(0, 40)</code>"],
          ["<code>col</code>", "填色（顏色名稱或色碼）", "<code>col = \"lightblue\"</code>、<code>\"#F6B6D2\"</code>"],
          ["<code>border</code>", "邊框顏色", "<code>border = \"gray40\"</code>"],
          ["<code>breaks</code>", "直方圖大約分幾組", "<code>breaks = 10</code>"],
          ["<code>lty</code>／<code>lwd</code>", "線條樣式／粗細", "<code>lty = 2</code>（虛線）"],
          ["<code>cex.names</code>", "長條圖類別文字大小", "<code>cex.names = 0.7</code>"],
        ] },
        { type: "table", head: ["圖", "放什麼資料", "用在"], rows: [
          ["<code>hist()</code>", "原始數值（一整欄）", "連續變項的分布"],
          ["<code>boxplot()</code>", "原始數值；分組用 <code>數值 ~ 組別</code>", "中位數、四分位、離群值"],
          ["<code>barplot()</code>", "<b>次數表</b>（先 table）", "類別變項各組人數"],
          ["<code>pie()</code>", "<b>次數表</b>", "各組比例"],
        ] },
        { type: "try", title: "試試看：改參數",
          task: "把 breaks 改成 5 和 20、把 col 換成 \"lightblue\"，看圖怎麼變。最後一行是「分組盒形圖」，對照講義第 51 頁的離群值。",
          starter: R`d1 <- read.csv("scores.csv")
hist(d1$scores, main = "Histogram of Scores", xlab = "Score",
     col = "navajowhite", breaks = 10)
boxplot(scores ~ depart, data = d1, col = "aquamarine", cex.axis = 0.6)` },
        { type: "try", title: "動手寫：BMI 直方圖",
          task: "讀 <code>bmi.csv</code> 存成 <code>b</code>，畫 BMI 的直方圖（標題「BMI 分布」、x 軸「BMI」、顏色 lightblue、breaks = 8），並把結果存成 <code>h</code>。",
          starter: R`b <- read.csv("bmi.csv")
h <- hist(
)`,
          check: R`inherits(h, "histogram") && isTRUE(all.equal(sum(h$counts), 129))`,
          hint: "h <- hist(b$BMI, main = \"BMI 分布\", xlab = \"BMI\", col = \"lightblue\", breaks = 8)",
          answer: R`b <- read.csv("bmi.csv")
h <- hist(b$BMI, main = "BMI 分布", xlab = "BMI",
          col = "lightblue", breaks = 8)` },
        { type: "try", title: "動手寫：各組人數長條圖",
          task: "用 <code>bmi.csv</code>，先把各組（depart）人數存成 <code>dt</code>，再畫長條圖。",
          starter: R`b <- read.csv("bmi.csv")
dt <-
barplot(dt, main = "各組人數")`,
          check: R`isTRUE(all(dt == table(read.csv("bmi.csv")$depart)))`,
          hint: "barplot 要放次數表：dt <- table(b$depart)",
          answer: R`b <- read.csv("bmi.csv")
dt <- table(b$depart)
barplot(dt, main = "各組人數", col = "lightblue")` },
        { type: "html", html: `<p><b>存成圖片</b>（第 39 頁）：RStudio 右下 Plots → Export → Save as Image。想看更多圖的畫法，可以逛 The R Graph Gallery（第 40 頁）。</p>` },
        { type: "q", ids: ["b53", "b54", "b55"] },
      ],
    },
    {
      id: "A6", group: "01", icon: "📋", title: "總整理：實習課 01",
      goal: "考前一張表：運算、讀檔、描述統計、作圖，以及讀檔常見錯誤。",
      blocks: [
        { type: "table", head: ["想做的事", "寫法"], rows: [
          ["清空環境", "<code>rm(list = ls())</code>"],
          ["看／改工作資料夾", "<code>getwd()</code>／<code>setwd(\"C:/路徑\")</code>"],
          ["讀 txt／csv／xlsx", "<code>read.table(\"x.txt\", header = TRUE)</code>／<code>read.csv(\"x.csv\")</code>／<code>library(readxl); read_xlsx(\"x.xlsx\")</code>"],
          ["看資料", "<code>head()</code> <code>tail()</code> <code>dim()</code> <code>colnames()</code> <code>str()</code>"],
          ["取出一欄", "<code>資料$欄名</code>"],
          ["轉成類別", "<code>d$x &lt;- as.factor(d$x)</code>；<code>levels()</code>、<code>table()</code>"],
          ["中心位置", "<code>mean()</code> <code>median()</code>；眾數 <code>names(table(x))[which.max(table(x))]</code>"],
          ["分散程度", "<code>var()</code> <code>sd()</code> <code>quantile()</code> <code>range()</code> <code>IQR()</code>"],
          ["一次看完", "<code>summary()</code>"],
          ["畫圖", "<code>hist()</code> <code>boxplot()</code> <code>barplot(table(x))</code> <code>pie(table(x))</code>"],
        ] },
        { type: "table", head: ["錯誤訊息（關鍵字）", "白話", "怎麼修"], rows: [
          ["<code>cannot open file 'xxx'</code>／<code>No such file</code>", "找不到檔案", "檔名拼錯？副檔名對嗎？工作資料夾對嗎（getwd 看一下）？"],
          ["<code>there is no package called 'readxl'</code>", "套件還沒安裝", "先 <code>install.packages(\"readxl\")</code>"],
          ["<code>could not find function \"read_xlsx\"</code>", "套件沒載入", "先 <code>library(readxl)</code>"],
          ["<code>argument is not numeric or logical: returning NA</code>", "拿不是數字的東西算平均", "欄名打錯（大小寫？），<code>d$Scores</code> 取不到東西"],
          ["<code>'\\U' used without hex digits</code>", "路徑用了單條反斜線", "改成 <code>\\\\</code> 或 <code>/</code>"],
        ] },
        { type: "try", title: "除錯練習：讀檔算平均",
          task: "這段有 2 個錯，修到印出平均成績為止。",
          starter: R`d <- read.csv("score.csv")
m <- mean(d$Scores)
m`,
          check: R`isTRUE(all.equal(m, mean(read.csv("scores.csv")$scores)))`,
          hint: "①檔名少了一個 s ②欄名是小寫 scores",
          answer: R`d <- read.csv("scores.csv")
m <- mean(d$scores)
m` },
      ],
    },
    // ================= 實習課 02（9/17）=================
    {
      id: "L0", group: "02", icon: "🧱", title: "暖身：看懂一行 R",
      goal: "看到任何一行 R，都能拆出「存到哪裡、用什麼函數、給了哪些參數」。",
      blocks: [
        { type: "html", html: `
          <p>R 的程式幾乎都長成同一個樣子，先把這個模板記起來：</p>
          <div class="rl-formula"><span class="c1">結果名稱</span> <span class="c2">&lt;-</span> <span class="c3">函數名稱</span>(<span class="c4">參數名稱</span> = <span class="c5">值</span>, <span class="c4">參數名稱</span> = <span class="c5">值</span>)</div>
          <p>就像護理紀錄的「<b>把什麼</b>（值）<b>用什麼方法</b>（函數）<b>處理後，記在哪一欄</b>（結果名稱）」。</p>` },
        { type: "parts", code: R`y <- dbinom(x, size = 10, p = 0.5)`, parts: [
          ["y", "結果名稱（物件）。算出來的東西存在這個名字底下，之後打 y 就能叫出來。"],
          ["<-", "箭頭＝「存進去」。由右往左讀：把右邊算出來的結果存到左邊。按 Alt + - 可以快速打出來。"],
          ["dbinom", "函數名稱：二項分布的機率。函數後面一定緊接著小括號。"],
          ["( … )", "小括號裡面放「參數」，也就是要交給函數的材料，彼此用半形逗號隔開。"],
          ["x", "第一個參數沒寫名稱，R 會依照位置當成第一個參數（要算哪些次數的機率）。"],
          ["size = 10", "參數名稱 = 值。size 是試驗次數（丟 10 次）。"],
          ["p = 0.5", "成功機率 0.5。正式名稱是 prob，寫 p 也可以，因為 R 會自動補完參數名稱的開頭。"],
        ] },
        { type: "table", head: ["寫法", "意思", "例子"], rows: [
          ["<code>#</code>", "註解：# 後面的字 R 不會執行，是寫給人看的", "<code># 計算次數表</code>"],
          ["<code>c( )</code>", "把幾個值串成一排（向量）", "<code>c(10, 20, 30)</code>"],
          ["<code>1:6</code>", "從 1 到 6 的整數，等於 c(1,2,3,4,5,6)", "<code>0:10</code>"],
          ["<code>\"文字\"</code>", "文字一定要加<b>半形</b>雙引號；數字不用", "<code>\"Heads\"</code>"],
          ["<code>TRUE / FALSE</code>", "是／否，必須全大寫", "<code>replace = TRUE</code>"],
          ["<code>物件[3]</code>", "中括號＝取出第 3 個", "<code>x[3]</code>"],
          ["<code>=</code> vs <code>&lt;-</code>", "括號<b>裡面</b>給參數用 =；存結果用 &lt;-", "<code>seq(0, 10, by = 1)</code>"],
        ] },
        { type: "html", html: `<p><b>三個最常見的錯：</b>①大小寫不同（<code>Y</code> 和 <code>y</code> 是兩個東西）②用了全形符號（中文輸入法的 ，（）“”）③前面那一行沒執行，後面就找不到物件。</p>` },
        { type: "try", title: "試試看：存值、叫出來、看型態",
          task: "直接按「執行」，看看每一行印出什麼。再把最後一行的 <code>z1</code> 改成 <code>Z1</code>（大寫）執行一次，讀讀看錯誤訊息。",
          starter: R`z1 <- c(10, 20, 30)
z1
length(z1)     # 有幾個值
class(z1)      # 是什麼型態
z1[2]          # 取第 2 個
z1`, },
        { type: "try", title: "動手寫：算平均",
          task: "建立一個向量 <code>ages</code>，內容是 5 位病人的年齡 35、42、58、61、47；再用 <code>mean()</code> 算平均，存到 <code>m</code>。",
          starter: R`ages <-
m <-
m`,
          check: R`exists("ages") && length(ages) == 5 && isTRUE(all.equal(m, mean(c(35, 42, 58, 61, 47))))`,
          hint: "向量用 c( ) 把數字用逗號串起來；mean( ) 括號裡放 ages。",
          answer: R`ages <- c(35, 42, 58, 61, 47)
m <- mean(ages)
m` },
        { type: "q", ids: ["b40", "b15", "b17"] },
      ],
    },
    {
      id: "L1", group: "02", icon: "🎲", title: "Q1 擲骰子 1000 次（間斷均勻分布）", lec: ["bio_lab2", 3],
      goal: "會用 sample() 模擬、table() 算次數、barplot() 畫長條圖。",
      blocks: [
        { type: "html", html: `<p><b>情境：</b>公正骰子每一點出現機率都是 1/6。我們讓電腦「假裝」擲 1000 次，看看每點出現幾次。</p>` },
        { type: "code", code: R`set.seed(42)
num_rolls <- 1000
die_rolls <- sample(x = 1:6, size = num_rolls, replace = TRUE)
frequency_die <- table(die_rolls)
barplot(frequency_die, main = "骰子各點次數",
        xlab = "骰子點數", ylab = "次數")
relative_frequencies <- table(die_rolls) / num_rolls
probability_roll_3 <- relative_frequencies[3]
cat("Probability of rolling a 3:", probability_roll_3, "\n")
barplot(relative_frequencies, main = "骰子各點的機率",
        xlab = "骰子點數", ylab = "機率")`, notes: [
          "固定亂數的起點。有這行，每次執行結果都一樣，方便和同學、助教對答案；42 只是一個編號，換別的數字也可以。",
          "把 1000 存成 num_rolls，後面要改次數只要改這一行。",
          "<b>核心</b>：從 1:6 裡隨機抽 1000 次。<code>replace = TRUE</code>＝抽完放回去，下一次還能抽到同一點（骰子本來就這樣）。",
          "數一數每個點數各出現幾次，得到一張次數表。",
          "把次數表畫成長條圖；main＝圖標題、xlab／ylab＝橫軸／縱軸名稱。",
          "（上一行的延續：參數太長可以換行，只要括號還沒關，R 會繼續讀。）",
          "次數 ÷ 總次數＝相對次數，也就是用實驗估計出來的機率。",
          "中括號 [3] 取出第 3 個值，也就是點數 3 的機率。",
          "<code>cat()</code> 把文字和數字接起來印出；<code>\"\\n\"</code> 是換行符號。",
          "畫相對次數的長條圖，每根都會接近 1/6 ≈ 0.167。",
          "",
        ] },
        { type: "parts", code: R`sample(x = 1:6, size = num_rolls, replace = TRUE)`, parts: [
          ["x = 1:6", "要從哪些值裡面抽：1 到 6。"],
          ["size = num_rolls", "抽幾次：1000 次。"],
          ["replace = TRUE", "抽出來要不要放回去。擲骰子要放回；如果是抽籤不放回，就寫 FALSE（這也是預設值）。"],
        ] },
        { type: "try", title: "試試看：次數越多，越接近 1/6",
          task: "把 <code>num_rolls</code> 改成 30、300、30000，各執行一次，比較第 3 點的機率離 0.167 有多遠。",
          starter: R`set.seed(42)
num_rolls <- 30
die_rolls <- sample(x = 1:6, size = num_rolls, replace = TRUE)
relative_frequencies <- table(die_rolls) / num_rolls
relative_frequencies
barplot(relative_frequencies, main = "骰子各點的機率", ylim = c(0, 0.3))` },
        { type: "try", title: "動手寫：擲 500 次",
          task: "模擬擲骰子 <b>500 次</b>，結果存在 <code>rolls</code>，再用 <code>table()</code> 印出次數表。",
          starter: R`rolls <-
`,
          check: R`exists("rolls") && length(rolls) == 500 && all(rolls %in% 1:6)`,
          hint: "照著上面的 sample() 寫，size 改成 500；別忘了 replace = TRUE。",
          answer: R`rolls <- sample(x = 1:6, size = 500, replace = TRUE)
table(rolls)` },
        { type: "q", ids: ["b34", "b39", "b43"] },
      ],
    },
    {
      id: "L2", group: "02", icon: "🪙", title: "Q2 丟一次銅板（伯努利分布）", lec: ["bio_lab2", 4],
      goal: "知道 sample() 也可以抽文字，以及 cat() 怎麼印結果。",
      blocks: [
        { type: "code", code: R`coin_toss <- sample(c("Heads", "Tails"), size = 1)
cat("Result of a random coin toss:", coin_toss, "\n")`, notes: [
          "從「正面、反面」兩個文字中隨機抽 1 個。文字要加引號，並用 c( ) 串起來。只抽 1 次，所以不用 replace。",
          "印出結果。每次執行可能不一樣，因為這裡沒有 set.seed()。",
        ] },
        { type: "html", html: `<p><b>和統計的連結：</b>伯努利分布＝只試一次、結果只有成功（1）或失敗（0）。把這個實驗重複 n 次、數成功幾次，就是下一課的二項分布。</p>` },
        { type: "try", title: "試試看：改成擲 10 次再數",
          task: "把 size 改成 10，並加上 <code>replace = TRUE</code>，再用 table() 數正反面各幾次。想一想：如果不加 replace 會怎樣？",
          starter: R`coin_toss <- sample(c("Heads", "Tails"), size = 10, replace = TRUE)
coin_toss
table(coin_toss)` },
      ],
    },
    {
      id: "L3", group: "02", icon: "📊", title: "Q3 丟十次銅板（二項分布）", lec: ["bio_lab2", 5],
      goal: "會用 seq() 做出 x、用 dbinom() 算機率、用 plot(type = \"h\") 畫圖。",
      blocks: [
        { type: "code", code: R`x <- seq(0, 10, by = 1)
y <- dbinom(x, size = 10, p = 0.5)
plot(x, y, type = "h", xlab = "正面次數", ylab = "Probability",
     main = "正面的機率分布")`, notes: [
          "做出 0, 1, 2, …, 10 這 11 個數字（丟 10 次，正面可能出現 0～10 次）。和 <code>0:10</code> 一樣。",
          "對 x 裡的每一個次數，算出「丟 10 次、正面機率 0.5」時剛好出現那麼多次的機率。結果 y 也有 11 個值。",
          "以 x 為橫軸、y 為縱軸畫圖。<code>type = \"h\"</code> 畫直立線，適合間斷資料。",
          "",
        ] },
        { type: "table", head: ["函數", "意思", "例子（Bin(10, 0.5)）"], rows: [
          ["<code>seq(從, 到, by = 間隔)</code>", "做出等間隔的數列", "<code>seq(0, 10, by = 2)</code> → 0 2 4 6 8 10"],
          ["<code>dbinom(x, size, prob)</code>", "<b>剛好</b> x 次成功的機率", "<code>dbinom(5, 10, 0.5)</code> → 0.246"],
          ["<code>pbinom(q, size, prob)</code>", "<b>最多</b> q 次（≤ q）的累積機率", "<code>pbinom(3, 10, 0.5)</code> → 0.172"],
        ] },
        { type: "table", head: ["plot 的 type", "畫出來的樣子", "用在"], rows: [
          ["<code>\"p\"</code>（預設）", "點", "散佈圖"],
          ["<code>\"h\"</code>", "直立線（像長條）", "間斷分布：二項、卜瓦松"],
          ["<code>\"l\"</code>", "連成一條線", "連續分布：常態、均勻"],
          ["<code>\"b\"</code>", "點＋線", "想同時看點和趨勢"],
        ] },
        { type: "try", title: "試試看：改 p 看形狀",
          task: "把 p 改成 0.2 和 0.8，觀察圖形往哪邊偏。",
          starter: R`x <- 0:10
y <- dbinom(x, size = 10, p = 0.2)
round(y, 3)
plot(x, y, type = "h", lwd = 4, xlab = "正面次數", ylab = "Probability")` },
        { type: "try", title: "動手寫：剛好 8 次",
          task: "丟 <b>20 次</b>公正銅板，<b>剛好 8 次</b>正面的機率是多少？存到 <code>p8</code> 並印出。",
          starter: R`p8 <-
p8`,
          check: R`isTRUE(all.equal(p8, dbinom(8, 20, 0.5)))`,
          hint: "dbinom(要算的次數, size = 試驗次數, p = 成功機率)",
          answer: R`p8 <- dbinom(8, size = 20, p = 0.5)
p8` },
        { type: "try", title: "動手寫：最多 8 次",
          task: "同上，<b>最多 8 次</b>（0～8 次）正面的機率，存到 <code>p_le8</code>。提示：可以用 pbinom，也可以把 dbinom 加總。",
          starter: R`p_le8 <-
p_le8`,
          check: R`isTRUE(all.equal(p_le8, pbinom(8, 20, 0.5)))`,
          hint: "pbinom(8, size = 20, p = 0.5)，或 sum(dbinom(0:8, 20, 0.5))",
          answer: R`p_le8 <- pbinom(8, size = 20, p = 0.5)
p_le8
sum(dbinom(0:8, 20, 0.5))   # 兩種寫法答案一樣` },
        { type: "q", ids: ["b32", "b33", "b35", "b36", "b23"] },
      ],
    },
    {
      id: "L4", group: "02", icon: "🚑", title: "Q4–Q5 故障與車禍次數（卜瓦松分布）", lec: ["bio_lab2", 6],
      goal: "會用 dpois() 算單點機率、ppois() 算累積機率，並算出「以上」的機率。",
      blocks: [
        { type: "html", html: `<p>⚠️ 講義只有 Q4（儀器故障）；Q5（車禍）只在程式檔 <code>2_lab.R</code> 裡。</p>` },
        { type: "code", code: R`x <- 0:10
y <- dpois(x, lambda = 1)
plot(x, y, type = "h", xlab = "單位時間內發生次數", ylab = "Probability",
     main = "故障次數的分布")
x <- 0:20
y <- dpois(x, lambda = 10)
plot(x, y, type = "h", xlab = "單位時間內發生次數", ylab = "Probability")
ppois(16, lambda = 10)   # lower tail`, notes: [
          "一週故障 0～10 次。",
          "lambda＝平均每單位時間發生幾次。這裡平均一週故障 1 次。",
          "畫直立線圖。",
          "",
          "Q5：某道路每月車禍次數，看 0～20 次。注意 x 被<b>覆蓋</b>成新的值了。",
          "平均每月 10 次。",
          "",
          "<b>p 開頭＝累積</b>：每月車禍「16 次以下（含 16）」的機率，約 0.973。lower tail 指左邊那一段。",
        ] },
        { type: "table", head: ["想問的", "寫法", "λ = 2 的例子"], rows: [
          ["剛好 k 次", "<code>dpois(k, lambda)</code>", "<code>dpois(0, 2)</code> → 0.135"],
          ["k 次以下（≤ k）", "<code>ppois(k, lambda)</code>", "<code>ppois(2, 2)</code> → 0.677"],
          ["<b>k 次以上（≥ k）</b>", "<code>1 - ppois(k - 1, lambda)</code>", "6 次以上：<code>1 - ppois(5, 2)</code> → 0.017"],
          ["超過 k 次（&gt; k）", "<code>1 - ppois(k, lambda)</code> 或 <code>ppois(k, lambda, lower.tail = FALSE)</code>", "<code>1 - ppois(5, 2)</code>"],
        ] },
        { type: "html", html: `<p><b>考試最常錯：</b>「6 次以上」要減掉的是「5 次以下」，所以寫 <code>ppois(5, …)</code>，不是 <code>ppois(6, …)</code>。先在紙上畫數線，圈出要的範圍再寫。</p>` },
        { type: "try", title: "動手寫：病房跌倒件數",
          task: "病房平均每月 2 件跌倒。算出<b>一個月 0～6 件</b>各自的機率，存到 <code>fall</code>，並畫直立線圖。",
          starter: R`fall <-
fall
plot(0:6, fall, type = "h")`,
          check: R`isTRUE(all.equal(fall, dpois(0:6, 2)))`,
          hint: "dpois 的第一個參數可以直接放 0:6，一次算出 7 個機率。",
          answer: R`fall <- dpois(0:6, lambda = 2)
fall
plot(0:6, fall, type = "h", lwd = 4)` },
        { type: "try", title: "動手寫：6 件以上",
          task: "同上，一個月<b>6 件以上</b>的機率存到 <code>p6</code>。",
          starter: R`p6 <-
p6`,
          check: R`isTRUE(all.equal(p6, 1 - ppois(5, 2)))`,
          hint: "6 件以上 ＝ 1 − （5 件以下）",
          answer: R`p6 <- 1 - ppois(5, lambda = 2)
p6` },
        { type: "q", ids: ["b37", "b38", "b31", "b24"] },
      ],
    },
    {
      id: "L5", group: "02", icon: "🔔", title: "Q6–Q7 常態分布曲線", lec: ["bio_lab2", 7],
      goal: "會用 seq(by = 0.1) 做出細密的 x、用 dnorm() 畫曲線，並用 pnorm() 算面積。",
      blocks: [
        { type: "html", html: `<p>⚠️ 題號對照：講義 Q5＝程式檔 Q6（標準常態）；程式檔 Q7（身高）不在講義裡。</p>` },
        { type: "code", code: R`x <- seq(-3, 3, by = 0.1)
y <- dnorm(x, mean = 0, sd = 1)
plot(x, y, type = "l", ylab = "Probability")
x <- seq(142, 182, by = 1)
y <- dnorm(x, mean = 162, sd = 5)
plot(x, y, type = "l")`, notes: [
          "從 −3 到 3，每 0.1 取一個點，共 61 個。常態是連續的，點要夠密，連起來才會平滑。",
          "算每個 x 的常態<b>密度</b>高度。mean＝平均數、sd＝<b>標準差</b>（不是變異數）。",
          "<code>type = \"l\"</code> 把點連成線，畫出鐘形曲線。",
          "Q7：女生身高平均 162、標準差 5，x 取 162 ± 4 個標準差（142～182）。",
          "",
          "沒寫 xlab、ylab 時，R 會直接用變數名稱 x、y 當軸名稱。",
        ] },
        { type: "html", html: `<p><b>重要觀念：</b>連續分布的 <code>dnorm()</code> 是曲線的<b>高度</b>，不是機率。要問「落在某區間的機率」，要用 <code>pnorm()</code> 算面積：</p>` },
        { type: "table", head: ["想問的", "寫法", "N(162, 5²) 的例子"], rows: [
          ["低於 a 的比例", "<code>pnorm(a, mean, sd)</code>", "<code>pnorm(157, 162, 5)</code> → 0.159"],
          ["高於 a 的比例", "<code>1 - pnorm(a, mean, sd)</code>", "<code>1 - pnorm(172, 162, 5)</code> → 0.023"],
          ["介於 a 和 b", "<code>pnorm(b, …) - pnorm(a, …)</code>", "<code>pnorm(167,162,5) - pnorm(157,162,5)</code> → 0.683"],
          ["第 p 百分位數", "<code>qnorm(p, mean, sd)</code>", "<code>qnorm(0.975)</code> → 1.96"],
        ] },
        { type: "try", title: "試試看：改 sd",
          task: "把第二條曲線的 sd 改成 10，並用 <code>lines()</code> 疊在同一張圖上比較。",
          starter: R`x <- seq(142, 182, by = 0.5)
plot(x, dnorm(x, mean = 162, sd = 5), type = "l", lwd = 2, ylab = "Density")
lines(x, dnorm(x, mean = 162, sd = 10), col = "red", lwd = 2)` },
        { type: "try", title: "動手寫：畫身高曲線",
          task: "做出 x：從 142 到 182、<b>間隔 0.5</b>；y：N(162, 5²) 的密度；再畫成曲線。",
          starter: R`x <-
y <-
plot(x, y, type = "l")`,
          check: R`length(x) == 81 && isTRUE(all.equal(y, dnorm(seq(142, 182, by = 0.5), 162, 5)))`,
          hint: "seq(142, 182, by = 0.5)；dnorm(x, mean = 162, sd = 5)",
          answer: R`x <- seq(142, 182, by = 0.5)
y <- dnorm(x, mean = 162, sd = 5)
plot(x, y, type = "l")` },
        { type: "try", title: "動手寫：Hb 偏低的比例",
          task: "病人 Hb ~ N(12, 1.5²)。Hb <b>低於 9</b> 的比例存到 <code>low</code>。",
          starter: R`low <-
low`,
          check: R`isTRUE(all.equal(low, pnorm(9, 12, 1.5)))`,
          hint: "「低於」用 pnorm，順序是 pnorm(值, mean, sd)",
          answer: R`low <- pnorm(9, mean = 12, sd = 1.5)
low` },
        { type: "q", ids: ["b41", "b42", "b25"] },
      ],
    },
    {
      id: "L6", group: "02", icon: "🥤", title: "Q8 喝飲料的時間（連續均勻分布）", lec: ["bio_lab2", 8],
      goal: "會用 dunif() 畫均勻分布、punif() 算機率。",
      blocks: [
        { type: "html", html: `<p>⚠️ 題號對照：講義 Q6＝程式檔 Q8。</p>` },
        { type: "code", code: R`x <- seq(5, 25, by = 0.1)
y <- dunif(x, min = 10, max = 20)
plot(x, y, type = "l", ylab = "Probability")`, notes: [
          "x 故意取得比 10～20 寬（5～25），才看得到兩邊「掉下來」的樣子。",
          "min＝區間下限、max＝區間上限。區間內高度都是 1/(20−10) = 0.1，區間外是 0。",
          "畫出一個方盒子形狀。",
        ] },
        { type: "try", title: "動手寫：12 分鐘內喝完",
          task: "喝完時間 ~ U(10, 20)。<b>12 分鐘內</b>喝完的機率存到 <code>pu</code>。",
          starter: R`pu <-
pu`,
          check: R`isTRUE(all.equal(pu, 0.2))`,
          hint: "和 pnorm 一樣，p 開頭是累積機率：punif(值, min, max)",
          answer: R`pu <- punif(12, min = 10, max = 20)
pu` },
        { type: "q", ids: ["b27"] },
      ],
    },
    {
      id: "L7", group: "02", icon: "📋", title: "總整理：函數家族與錯誤訊息",
      goal: "考前一張表：d／p／q／r 四兄弟、各分布的參數名稱、錯誤訊息怎麼看。",
      blocks: [
        { type: "table", head: ["開頭", "意思", "問句", "例子"], rows: [
          ["<b>d</b>", "單點機率（間斷）／曲線高度（連續）", "剛好等於多少？", "<code>dbinom(5, 10, 0.5)</code>"],
          ["<b>p</b>", "累積機率 P(X ≤ x)", "小於等於的機率？", "<code>pnorm(1.96)</code> → 0.975"],
          ["<b>q</b>", "反過來：給機率找數值", "第幾百分位是多少？", "<code>qnorm(0.975)</code> → 1.96"],
          ["<b>r</b>", "產生隨機亂數", "模擬 n 筆資料", "<code>rnorm(5, 162, 5)</code>"],
        ] },
        { type: "table", head: ["分布", "後半段名稱", "要給的參數"], rows: [
          ["二項", "<code>binom</code>", "<code>size</code>（次數）、<code>prob</code>（成功機率，可簡寫 p）"],
          ["卜瓦松", "<code>pois</code>", "<code>lambda</code>（平均次數）"],
          ["常態", "<code>norm</code>", "<code>mean</code>、<code>sd</code>（標準差；不給就是 0 和 1）"],
          ["連續均勻", "<code>unif</code>", "<code>min</code>、<code>max</code>"],
        ] },
        { type: "html", html: `<p>記法：<b>開頭（d/p/q/r）＋分布名稱</b>，例如 <code>p</code> + <code>pois</code> = <code>ppois</code>。</p>` },
        { type: "table", head: ["錯誤訊息（關鍵字）", "白話", "怎麼修"], rows: [
          ["<code>object 'x' not found</code>", "找不到叫 x 的東西", "前面建立 x 的那行沒執行？拼錯或大小寫不同？文字忘了加引號？"],
          ["<code>could not find function</code>", "找不到這個函數", "函數名稱拼錯，或要先 <code>library()</code> 載入套件"],
          ["<code>unexpected symbol</code>", "語法看不懂", "少了逗號或括號；變數名稱以數字開頭"],
          ["<code>unexpected input</code>", "出現奇怪的字元", "用了全形符號（，（）“”），切換成半形"],
          ["<code>cannot take a sample larger than the population</code>", "抽的次數比選項多", "加上 <code>replace = TRUE</code>"],
          ["<code>unused argument</code>", "給了函數不認得的參數", "參數名稱拼錯，例如把 lambda 寫成 lamda"],
          ["<code>non-numeric argument</code>", "拿文字做數學運算", "數字外面多了引號？"],
          ["Console 出現 <code>+</code> 一直等", "括號或引號沒關", "按 Esc 取消，把括號補齊"],
        ] },
        { type: "try", title: "除錯練習：這段有 3 個錯",
          task: "執行看看錯誤訊息，一個一個修好。修到能畫出圖為止。",
          starter: R`x <- 0：10
y <- dpois(x, lamda = 2)
plot(X, y, type = "h")`,
          check: R`exists("y") && isTRUE(all.equal(y, dpois(0:10, 2)))`,
          hint: "①冒號是全形 ②lambda 拼錯 ③plot 裡的 X 是大寫",
          answer: R`x <- 0:10
y <- dpois(x, lambda = 2)
plot(x, y, type = "h")` },
      ],
    },
  ];

  // ---------- 錯誤訊息翻譯 ----------
  const ERR = [
    [/cannot open file '([^']+)'/, (m) => `找不到檔案「${m[1]}」：檔名或副檔名拼錯？工作資料夾對嗎？（getwd() 看一下）`],
    [/cannot open (the )?connection|No such file/, () => "找不到檔案：檔名或副檔名拼錯？工作資料夾對嗎？（getwd() 看一下）"],
    [/cannot change working directory/, () => "找不到這個資料夾：路徑拼錯，或這台電腦沒有這個資料夾。（瀏覽器練習區沒有你電腦上的資料夾，setwd 只能在自己的 RStudio 用。）"],
    [/there is no package called .([A-Za-z0-9.]+)/, (m) => `套件「${m[1]}」還沒安裝，先執行 install.packages("${m[1]}")。`],
    [/used without hex digits/, () => "路徑裡用了單條反斜線，請改成兩條反斜線或正斜線 /。"],
    [/argument is not numeric or logical/, () => "拿不是數字的東西算平均：多半是欄位名稱打錯（大小寫？），$ 後面取不到東西。"],
    [/object '([^']+)' not found/, (m) => `找不到「${m[1]}」：前面建立它的那行有沒有執行？有沒有拼錯、大小寫不同？如果它是文字，要加引號。`],
    [/could not find function "([^"]+)"/, (m) => `找不到函數「${m[1]}」：名稱拼錯，或需要先 library() 載入套件。`],
    [/unexpected input/, () => "出現 R 看不懂的字元，最常見的是全形符號（，（）：“”），請切換成半形。"],
    [/unexpected symbol/, () => "語法錯誤：可能少了逗號或括號，或變數名稱以數字開頭。"],
    [/unexpected '([^']+)'/, (m) => `多了或放錯位置的「${m[1]}」，檢查括號和逗號有沒有成對。`],
    [/unexpected end of input/, () => "程式沒寫完：括號或引號沒有關起來。"],
    [/cannot take a sample larger than the population/, () => "抽的次數比選項多，要加 replace = TRUE。"],
    [/unused argument/, () => "給了函數不認得的參數，檢查參數名稱有沒有拼錯。"],
    [/non-numeric argument/, () => "拿文字做數學運算了，數字外面是不是多了引號？"],
    [/argument "([^"]+)" is missing/, (m) => `少給了必要的參數「${m[1]}」。`],
  ];
  const explainErr = (msg) => { for (const [re, f] of ERR) { const m = re.exec(msg); if (m) return f(m); } return ""; };

  // ---------- 簡易語法上色 ----------
  function hl(code, esc) {
    return code.split("\n").map((line) => {
      let out = "", rest = line;
      const hash = (() => { let q = null; for (let i = 0; i < line.length; i++) { const c = line[i]; if (q) { if (c === q) q = null; } else if (c === '"' || c === "'") q = c; else if (c === "#") return i; } return -1; })();
      let comment = "";
      if (hash >= 0) { comment = line.slice(hash); rest = line.slice(0, hash); }
      out = esc(rest)
        .replace(/(&quot;[^&]*?&quot;|"[^"]*")/g, '<span class="tk-s">$1</span>')
        .replace(/\b([A-Za-z_.][A-Za-z0-9_.]*)(?=\()/g, '<span class="tk-f">$1</span>')
        .replace(/(&lt;-)/g, '<span class="tk-o">$1</span>')
        .replace(/\b(TRUE|FALSE)\b/g, '<span class="tk-k">$1</span>')
        .replace(/(^|[^\w.">])(\d+\.?\d*)/g, '$1<span class="tk-n">$2</span>');
      return out + (comment ? `<span class="tk-c">${esc(comment)}</span>` : "");
    }).join("\n");
  }

  // ---------- 畫面 ----------
  TOOLS.rlearn = function (main, U) {
    const prog = U.load("rlearn", { cur: "A1", pass: {} });
    const save = () => U.save("rlearn", prog);
    const tries = (L) => L.blocks.filter((b) => b.type === "try" && b.check).length;
    const passed = (L) => L.blocks.filter((b, i) => b.type === "try" && b.check && prog.pass[L.id + ":" + i]).length;

    function nav() {
      const groups = [["01", "實習課 01（9/10）：R 入門、讀檔、描述統計、作圖"], ["02", "實習課 02（9/17）：機率分布"]];
      return groups.map(([g, label]) => `<h3>${label}</h3><div class="tiles rl-nav">${LESSONS.filter((L) => L.group === g).map((L) => {
        const t = tries(L), p = passed(L);
        const badge = t ? `<span class="pill ${p === t ? "ok" : ""} badge">${p}/${t}</span>` : "";
        return `<a class="tile ${L.id === prog.cur ? "rl-on" : ""}" href="javascript:void 0" data-l="${L.id}">${badge}<div class="ic">${L.icon}</div><div class="tt">${U.esc(L.title)}</div></a>`;
      }).join("")}</div>`).join("");
    }

    function render() {
      const L = LESSONS.find((x) => x.id === prog.cur) || LESSONS[0];
      const idx = LESSONS.indexOf(L);
      main.innerHTML = `<div class="card"><h2>🧑‍🏫 R 語法逐行教學（實習課 01＋02）</h2>
        <div class="muted small">照順序上：實習課 01 從 RStudio 操作、讀檔、描述統計到作圖；實習課 02 逐題拆解助教的 <code>2_lab.R</code>。每課都有「動手寫」，按執行會自動批改；錯了先看錯誤訊息的白話解釋，再看提示，最後才看答案。程式在瀏覽器裡執行，第一次約需 10–30 秒載入。</div></div>
        ${nav()}
        <div class="card"><h2>${L.icon} ${U.esc(L.title)}</h2>
          <div class="explain"><b>這課學完你會：</b>${L.goal}</div>
          ${L.lec ? `<div class="small" style="margin-top:6px">對照講義：${U.refLink(L.lec)}</div>` : ""}
        </div>
        <div id="rlb"></div>
        <div class="slide-nav" style="justify-content:space-between">
          <button class="btn" id="rlp" ${idx === 0 ? "disabled" : ""}>◀ 上一課</button>
          <button class="btn primary" id="rln" ${idx === LESSONS.length - 1 ? "disabled" : ""}>下一課 ▶</button></div>`;
      const host = U.$("#rlb");
      L.blocks.forEach((b, i) => host.appendChild(block(L, b, i)));
      main.querySelectorAll(".rl-nav").forEach((n) => (n.onclick = (e) => { const a = e.target.closest("[data-l]"); if (a) go(a.dataset.l); }));
      U.$("#rlp").onclick = () => go(LESSONS[idx - 1].id);
      U.$("#rln").onclick = () => go(LESSONS[idx + 1].id);
    }
    function go(id) { prog.cur = id; save(); render(); window.scrollTo(0, 0); }

    function block(L, b, i) {
      const el = document.createElement("div");
      el.className = "card";
      if (b.type === "html") el.innerHTML = b.html;
      else if (b.type === "table") el.innerHTML = `<div style="overflow-x:auto"><table class="gl-table"><tr>${b.head.map((h) => `<th>${h}</th>`).join("")}</tr>${b.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</table></div>`;
      else if (b.type === "parts") {
        el.innerHTML = `<h3 style="margin-top:0">🔍 零件拆解</h3><pre class="rl-code">${hl(b.code, U.esc)}</pre>
          <div class="rl-parts">${b.parts.map(([k, v]) => `<div><code class="rl-chip">${U.esc(k)}</code><span>${v}</span></div>`).join("")}</div>`;
      } else if (b.type === "code") {
        const lines = b.code.split("\n");
        el.innerHTML = `<h3 style="margin-top:0">📜 助教的程式，一行一行看</h3>
          <div class="rl-lines">${lines.map((ln, k) => `<div class="rl-line"><pre class="rl-code">${hl(ln, U.esc) || " "}</pre><div class="small">${b.notes[k] || ""}</div></div>`).join("")}</div>
          <div class="slide-nav"><button class="btn small" data-copy>把整段貼到下面的練習區執行</button></div>${b.copyNote ? `<div class="small muted">⚠️ ${b.copyNote}</div>` : ""}<div class="rl-run"></div>`;
        const box = el.querySelector(".rl-run");
        el.querySelector("[data-copy]").onclick = (e) => { e.target.remove(); box.appendChild(runner({ starter: b.code }, L, i)); };
      } else if (b.type === "try") {
        el.innerHTML = `<h3 style="margin-top:0">${b.check ? "✍️" : "🧪"} ${U.esc(b.title)}</h3><div>${b.task}</div>`;
        el.appendChild(runner(b, L, i));
      } else if (b.type === "q") {
        el.innerHTML = `<h3 style="margin-top:0">🧠 看程式猜結果</h3><div class="small muted">答錯會進錯題本。</div>`;
        b.ids.forEach((id, k) => { const q = U.qById(id); if (q) U.renderQ(q, el, { num: k + 1 }); });
      }
      return el;
    }

    function runner(b, L, i) {
      const key = L.id + ":" + i;
      const drafts = U.load("rldraft", {});
      const wrap = document.createElement("div");
      wrap.innerHTML = `<textarea class="code" spellcheck="false" style="min-height:${Math.max(90, (b.starter.split("\n").length + 1) * 22)}px"></textarea>
        <div class="slide-nav" style="flex-wrap:wrap"><button class="btn primary" data-a="run">▶ 執行${b.check ? "並批改" : ""}</button>
          <button class="btn small" data-a="reset">還原</button>
          ${b.hint ? `<button class="btn small" data-a="hint">💡 提示</button>` : ""}
          ${b.answer ? `<button class="btn small" data-a="ans">👀 看答案</button>` : ""}
          ${b.check && prog.pass[key] ? `<span class="pill ok">已通過</span>` : ""}</div>
        <div class="rl-msg"></div><pre class="out" style="display:none"></pre><div class="plots"></div>`;
      const ta = wrap.querySelector("textarea"), out = wrap.querySelector("pre.out"), msg = wrap.querySelector(".rl-msg"), plots = wrap.querySelector(".plots");
      ta.value = drafts[key] ?? b.starter;
      ta.oninput = () => { drafts[key] = ta.value; U.save("rldraft", drafts); };
      const log = (t, cls) => { out.style.display = ""; const s = document.createElement("span"); if (cls) s.className = cls; s.textContent = t + "\n"; out.appendChild(s); };
      const run = async () => {
        out.textContent = ""; out.style.display = "none"; plots.innerHTML = ""; msg.innerHTML = "";
        const btn = wrap.querySelector('[data-a="run"]'); btn.disabled = true;
        msg.innerHTML = `<div class="small muted">執行中…（第一次需要載入 R，請稍候）</div>`;
        try {
          const r = await window.RRUN.runR(ta.value, { check: b.check, fresh: true });
          msg.innerHTML = "";
          r.out.forEach((o) => log(o.data, o.type === "stderr" ? "err" : ""));
          r.images.forEach((img) => { const cv = document.createElement("canvas"); cv.width = img.width; cv.height = img.height; cv.getContext("2d").drawImage(img, 0, 0); plots.appendChild(cv); });
          if (r.error) {
            const ex = explainErr(r.error);
            msg.innerHTML = `<div class="explain" style="border-color:var(--bad);background:var(--bad-soft)">❌ 程式出錯，執行到錯誤那一行就停了（下方紅字是原始訊息）${ex ? `<div>👉 ${U.esc(ex)}</div>` : ""}</div>`;
          } else if (r.out.some((o) => o.type === "stderr" && /Warning|警告/.test(o.data)) && explainErr(r.out.map((o) => o.data).join(" "))) {
            // 沒有錯誤但有警告（例如欄名打錯造成 NA），也給白話提醒
            msg.innerHTML = `<div class="explain" style="border-color:var(--warn);background:var(--warn-soft)">⚠️ 程式跑完了，但 R 發出警告：${U.esc(explainErr(r.out.map((o) => o.data).join(" ")))}</div>`;
          } else if (b.check) {
            if (r.ok) { prog.pass[key] = true; save(); msg.innerHTML = `<div class="explain" style="border-color:var(--ok);background:var(--ok-soft)">✅ 正確！</div>`; }
            else msg.innerHTML = `<div class="explain" style="border-color:var(--warn);background:var(--warn-soft)">還不對。確認結果有存到指定的名稱，數值也正確。${b.hint ? "可以按「提示」。" : ""}</div>`;
          }
        } catch (e) {
          const m = String(e.message || e);
          const ex = explainErr(m);
          msg.innerHTML = `<div class="explain" style="border-color:var(--bad);background:var(--bad-soft)">❌ 程式出錯了<div class="small" style="font-family:var(--mono)">${U.esc(m)}</div>${ex ? `<div>👉 ${U.esc(ex)}</div>` : ""}</div>`;
        }
        btn.disabled = false;
      };
      wrap.onclick = (e) => {
        const a = e.target.closest("[data-a]")?.dataset.a; if (!a) return;
        if (a === "run") run();
        if (a === "reset") { ta.value = b.starter; delete drafts[key]; U.save("rldraft", drafts); }
        if (a === "hint") msg.innerHTML = `<div class="explain">💡 ${b.hint}</div>`;
        if (a === "ans") msg.innerHTML = `<div class="explain">參考答案（先自己試過再看）：<pre class="rl-code">${hl(b.answer, U.esc)}</pre></div>`;
      };
      ta.onkeydown = (e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); } };
      return wrap;
    }

    render();
  };
})();
