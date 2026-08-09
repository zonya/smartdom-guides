---
title: "Najbolji jeftini Zigbee senzori i utičnice za početak"
description: "Konkretan spisak Zigbee hardvera za prvi pametan dom — koordinator, utičnice i senzori, sa modelima, okvirnim cenama i onim što se ne kupuje na početku."
pubDate: 2026-08-09
tags: ["home-assistant", "hardver", "zigbee", "senzori"]
---

Ako si već zaključio da ideš na Zigbee, ostaje najneprijatniji deo: da od hiljadu skoro istih uređaja izabereš prvih pet. Ovde nema ni jedne opšte priče — ovo je spisak koji bismo dali prijatelju koji sutra kupuje, sa modelima, okvirnim cenama i objašnjenjem zašto baš to.

Jedna napomena pre svega: **nemoj kupiti sve odjednom.** Koordinator, dve utičnice i tri senzora su dovoljni da napraviš prve automatizacije. Posle mesec dana ćeš mnogo bolje znati šta ti stvarno treba, a ono što si mislio da ti treba često završi u fioci.

## Spisak za nestrpljive

| Šta | Model | Okvirno |
|---|---|---|
| Koordinator | Sonoff ZBDongle-E | 20-25€ |
| Utičnica ×2 | Sonoff S26R2ZB ili Nous A1Z | 10-13€ po kom. |
| Senzor otvaranja | Sonoff SNZB-04P | 10-13€ |
| Senzor pokreta | Sonoff SNZB-03P | 10-13€ |
| Temperatura i vlažnost | Sonoff SNZB-02D | 10-13€ |
| USB produžni kabl | bilo koji, 1m | 2-3€ |

Ukupno oko **75-90€** sa domaćih sajtova, ili **45-60€** sa AliExpressa ako imaš strpljenja da čekaš. Cene su iz avgusta 2026. i prilično skaču na akcijama, pa ih uzmi kao red veličine, ne kao ponudu.

## Koordinator — jedan uređaj koji ne smeš da promašiš

Koordinator je USB stik koji pravi Zigbee mrežu. To je jedini deo gde loš izbor boli, jer ako mreža nije stabilna, svih dvadeset uređaja radi loše, a ti ne znaš zašto.

**Sonoff ZBDongle-E** je najsigurniji izbor za početak. Najzastupljeniji je u Home Assistant zajednici, radi bez podešavanja, dolazi sa antenom i drži mrežu od nekoliko desetina uređaja bez muke.

⚠️ **Pazi na slovo na kraju.** Postoji i **ZBDongle-P**, koji izgleda skoro identično i često je jeftiniji — drugi je čip i drugačije se ponaša. Ako ne znaš zašto ti treba P, uzmi **E**.

Tri stvari koje se ponavljaju kao greške:

1. **Obavezno preko USB produžnog kabla.** Ubodeš li stik direktno u server, i to pored USB 3.0 porta ili SSD-a, hvata smetnje i mreža ti radi na pola. Metar kabla je najjeftiniji upgrade koji ćeš uraditi.
2. **Razdvoji kanale od WiFi-ja.** Zigbee i WiFi dele 2.4GHz. Ako ti je WiFi na kanalu 1, Zigbee stavi na 25 ili 26 i obrnuto.
3. **Ne stavljaj ga u orman u podrumu.** Koordinator treba da bude što bliže centru stana.

Ako ti server stoji u ostavi ili u rack-u u uglu stana, vredi razmisliti o **SMLIGHT SLZB-06**. To nije USB stik nego mala kutija koja ide na mrežni kabl (ima i PoE verziju), pa je možeš staviti gde je najbolji signal, a ne gde je server. Skuplja je nekih 15-20€ i za prvi put nije neophodna — ali ako već znaš da će server biti u lošem uglu, uzmi je odmah i preskoči jednu buduću glavobolju.

## Utičnice — one nisu samo utičnice

Zigbee utičnice na struji rade i kao **pojačivači mreže**: prosleđuju signal daljim uređajima. Zato se ne kupuju „po potrebi" nego kao deo infrastrukture. Dve-tri utičnice raspoređene po stanu su razlika između mreže koja radi i mreže koja se povremeno gubi.

**Sonoff S26R2ZB** je najjeftiniji razuman izbor. **Nous A1Z** je nešto skuplji i ima **merenje potrošnje**, što zvuči kao sitnica, a nije — merenje potrošnje ti otvara automatizacije koje inače ne možeš da napraviš:

- javi kad je mašina za pranje veša završila (potrošnja padne ispod 5W duže od dva minuta),
- ugasi punjač koji je zaboravljen uključen,
- vidi šta ti u kući stvarno jede struju, a ne po osećaju.

Naš savet: uzmi **jednu sa merenjem** (stavi je na mašinu za veš ili sudove) i **jednu bez** (za lampu). Videćeš vrlo brzo koja ti se više isplati, pa dalje kupuj takve.

Ako ti se ne pale i ne gase uređaji, nego ti treba da **običan zidni prekidač i dalje radi normalno** — utičnica nije rešenje, tu ide modul iza prekidača (Sonoff ZBMINIR2 ili Shelly). O tome pišemo posebno, jer podrazumeva rad sa strujom.

## Senzor otvaranja vrata i prozora

Najjeftiniji uređaj, a pokreće najviše automatizacija. Dva magneta — jedan na krilo, drugi na ram, i Home Assistant zna da li su vrata otvorena.

**Sonoff SNZB-04P** je ovde jasan izbor. Koristi veću CR2477 bateriju i realno traje godinama, ima i **tamper** prekidač (javi ako neko odvali senzor sa zida), što je korisno ako ga koristiš kao deo alarma.

Šta se sve pravi od jednog senzora na ulaznim vratima:

- ugasi grejanje ako je prozor otvoren duže od pet minuta,
- upali svetlo u predsoblju kad se vrata otvore, ali samo posle zalaska sunca,
- javi na telefon ako su vrata ostala otvorena, a nikoga nema kod kuće.

Za ostavu i podrum ista logika radi kao „upali svetlo kad otvorim, ugasi kad zatvorim" — i to je automatizacija koju ljudi najduže koriste, jer je jedina koja se nikad ne pokvari.

## Senzor pokreta

**Sonoff SNZB-03P** je jeftin i sasvim dobar. **Aqara P1** je skuplji, ali ima jednu stvar koja se isplati: **možeš da menjaš interval prijavljivanja**. Jeftini senzori posle detekcije „ćute" oko minut da bi štedeli bateriju, i onda ti se svetlo u kupatilu ugasi dok si još unutra.

Zato jedno pravilo: **prvi senzor pokreta ne stavljaj u kupatilo.** Stavi ga u hodnik, ostavu ili predsoblje — mesta gde prolaziš, a ne mesta gde stojiš mirno. Kupatilo i radni sto su najteži slučajevi i tamo ćeš ionako pre ili kasnije preći na senzor prisustva (mmWave), koji je druga i skuplja priča.

Većina ovih senzora javlja i **osvetljenost**, pa svetlo ne mora da se pali po satu nego po tome koliko je zaista mračno. To je jedna od retkih automatizacija koju i ostatak kuće primeti kao poboljšanje, a ne kao tvoju igračku.

## Temperatura i vlažnost

**Sonoff SNZB-02D** ima ekran, pa je koristan i kad Home Assistant ne radi — nekome u kući će to biti važnije nego tebi. Baterija traje oko godinu i po.

Uzmi **dva**: jedan u dnevnoj, jedan u kupatilu ili spavaćoj. Sa jednim senzorom imaš broj; sa dva imaš **razliku**, a razlika je ono od čega se prave korisne stvari — uključi odvlaživač kad je vlažnost u kupatilu 20% viša od ostatka stana, javi kad je u dečjoj sobi hladnije od 19°C.

Ovi senzori su i najbolji test mreže. Ako ti onaj u najdaljoj sobi povremeno „nestane", mreža ti je slaba u tom delu i tu treba utičnica kao pojačivač.

## Jedan senzor koji nije na spisku, ali ga stavi

**Senzor vode (Sonoff SNZB-05P)**, oko 12€. Nije zabavan, nikad se ne aktivira, i jedini je uređaj sa ovog spiska koji može da ti se isplati sto puta u jednoj noći. Ide pod bojler, pod sudoperu, za mašinu za veš — svuda gde bi voda tekla tri sata pre nego što bi neko primetio.

Ako želiš da ideš do kraja, kombinuj ga sa Zigbee ventilom na dovodu vode, pa se voda sama zatvori. To je već skuplja investicija, ali logika automatizacije je ista i napraviš je u pet minuta.

## Šta ne kupovati na početku

- **Zigbee sijalice kao prvu kupovinu.** Ako neko ugasi svetlo na zidnom prekidaču, pametna sijalica je mrtva i ne javlja se. Prvo reši prekidače i utičnice, sijalice dođu kasnije.
- **Zidne prekidače koji traže nulu.** Pola stanova u Srbiji nema neutralni provodnik u kutiji prekidača. Proveri to **pre** kupovine, ne posle.
- **Termostatske ventile (TRV) u prvom krugu.** Odlični su, ali podrazumevaju da već imaš senzore temperature i da znaš kako ti se stan zaista greje. Kupiš ih prerano i samo ti smetaju.
- **Uređaje bez oznake modela.** Na AliExpressu ima mnogo senzora čiji je opis „Tuya ZigBee 3.0 Smart Sensor". Ako u opisu nema konkretne oznake modela, ne možeš da proveriš da li ga Zigbee2MQTT podržava. Nemoj se kockati za 4€ razlike.
- **Startni paketi (dongle + hub + 4 senzora).** Skoro uvek sadrže nešto što ti ne treba i vezan hub proizvođača, koji ti sa Home Assistant-om baš i nije potreban.

## Gde kupovati

**AliExpress** je 30-50% jeftiniji i tamo je najveći izbor, ali čekaš dve do četiri nedelje i reklamacija je muka. Ima smisla za senzore — ako jedan od pet zakaže, i dalje si na dobitku.

**Domaći i regionalni sajtovi** su skuplji, ali stižu za par dana, imaš garanciju i vraćanje. Za **koordinator** preporučujemo baš to: to je jedini uređaj gde ne želiš da mesec dana čekaš zamenu, jer bez njega ti ništa ne radi.

Dobro pravilo: **koordinator kupi lokalno, senzore sa AliExpressa.**

## Kad ti hardver stigne

Kratko, da ne ostaneš u pola posla. U Home Assistant-u imaš dva načina da vodiš Zigbee mrežu — **ZHA** (ugrađen, klikneš i radi) i **Zigbee2MQTT** (traži malo više podešavanja, ali podržava više uređaja i daje ti mnogo više kontrole). Za prvih deset uređaja ZHA je sasvim dovoljan, i kasnije se može preći.

Dve stvari koje će ti uštedeti veče:

1. **Prvo upari uređaje na struji** (utičnice), pa onda baterijske. Tako baterijski senzori odmah nađu pojačivač i lepo se rasporede po mreži.
2. **Upari senzor tamo gde će stajati**, ne za stolom pored servera. Zigbee pamti kroz koga ide signal, a taj put se posle preseljenja popravlja sporo.

Ako Home Assistant još nemaš, kreni od [instalacije za 30 minuta](/blog/instalacija-home-assistant-30-minuta/), a ako se još lomiš između protokola, tu je i [Zigbee vs Z-Wave vs WiFi](/blog/zigbee-zwave-wifi-koji-hardver/).

## Realno očekivanje

Sa koordinatorom, dve utičnice i tri senzora — dakle za nekih 70-80€ — možeš da napraviš svih pet automatizacija iz teksta [Prvih 5 automatizacija](/blog/prvih-5-automatizacija/). To je ceo prvi krug i preporučujemo da staneš tu.

Ono što se posle skoro svima dogodi je isto: kupiš još senzora otvaranja, jer su najjeftiniji i najkorisniji; kupiš još jednu utičnicu sa merenjem, jer si zavoleo podatke; i shvatiš da ti ne treba još hardvera nego bolje automatizacije od onih koje već imaš.
