# webb24-js2-slutprojekt-Sanja-Korazija

Web Shop Projekt

Projektbeskrivning

Detta projekt är en webbutiksapplikation som möjliggör för användare att bläddra igenom produkter, lägga dem i kundvagnen och genomföra köp. Applikationen består av en frontend-del utvecklad i React och en backend-del i Node.js med Express.

Frontend
React: För att bygga användargränssnittet.
Axios (eller fetch API): För HTTP-förfrågningar till backend-servern.

Backend
Express: För att bygga REST API

CORS: För att möjliggöra åtkomst till API
från andra domäner.
fs/promises: För att arbeta med filer (läsa och skriva).

Starta Servern:
Starta backend-servern: npm Starta
Starta frontend-servern: npm run dev

Struktur
Frontend
App.jsx: Huvudkomponenten som hanterar sidor, kundvagn och meddelanden.
Navbar.jsx: Navigationsfält som möjliggör övergång mellan sidor och sökning av produkter.
ProductsPage.jsx: Visar en lista över produkter och möjliggör sortering.
CartPage.jsx: Visar produkter i kundvagnen, möjliggör tömning av kundvagnen och slutförande av köp.
ProductCard.jsx: Visar enskild information om produkten och möjliggör tillägg till kundvagnen.

Backend
index.js: Huvudfilen för servern som definierar rutter för produkter och kundvagn.
products.js: Innehåller funktioner för att läsa, söka och uppdatera produkter från JSON-filen (products.json).
products.json: Innehåller information om produkter, inklusive namn, pris, kvantitet och bild-URL

Funktioner:
1.Frontend

App.jsx:
Hanterar applikationens tillstånd (kundvagn, produkter, nuvarande sida).
Laddar produkter vid montering.

Navbar.jsx:
Möjliggör navigering mellan sidor (produkter och kundvagn).
Implementerar produkt-sökning.

ProductsPage.jsx:
Visar alla produkter med möjlighet till sortering.
Använder komponenten ProductCard för att visa enskilda produkter.

CartPage.jsx:
Visar produkter i kundvagnen, inklusive totalt pris.
Möjliggör för användare att tömma kundvagnen eller genomföra köp.

index.html:
HTML-filen fungerar som huvudentrypunkten för applikationen. Den innehåller följande:
<div id="root">: Här kommer React-komponenterna att renderas.
Länkar till en extern stylesheet för att styla applikationen.

CSS (style.css):
Denna fil innehåller stilar för olika komponenter i applikationen. Några av de viktigaste stilarna inkluderar:

.product-card: Grundläggande stil för produktkort, inklusive marginaler och padding.
.cart-item: Flexbox-stil för att placera bilder och text för varje objekt i kundvagnen.
.button-container: Används för att styla knappar i kundvagnssidan med en jämn fördelning.
.cart-button: Stilar för knapparna i kundvagnen, inklusive färger och hover-effekter.
.nav-button: Stilar för navigationsknappar med hover-effekter för bättre användarupplevelse.
input[type="text"]: Stil för sökfältet.
.thank-you-message: Stor och centrerad text för att visa ett tackmeddelande efter slutfört köp.

main.jsx:
Denna fil är applikationens ingångspunkt som ansvarar för att rendera huvudkomponenten App.
createRoot: Används för att skapa en rotkomponent för React-applikationen.
document.querySelector("#root"): Väljer <div>-elementet i index.html där React kommer att rendera innehållet.
root.render(<App />): Renderar App-komponenten som innehåller hela applikationen.

.gitignore:
Denna fil används för att specificera vilka filer och mappar som ska ignoreras av Git.
/node_modules: Ignorerar mappen där alla npm-bibliotek installeras, vilket kan vara mycket stort och inte behövs i versionskontrollen.
/.parcel-cache: Ignorerar cache-filer som skapas av Parcel, ett webbundlingsverktyg.
/dist: Ignorerar den byggda versionen av applikationen, som genereras under byggprocessen.

package.json: 
Innehåller dependencies för frontend app.

docs-mappen:
Innehåller den genererade dokumentationen för applikationen efter att den har byggts. 


2.Backend 

index.js:
Definierar rutter för åtkomst till produkter och hantering av kundvagn.
Implementerar logik för att lägga till produkter i kundvagnen, tömma kundvagnen och genomföra köp.

products.js:
Hanterar produktdata genom att läsa från products.json.
Implementerar produkt-sökning och uppdatering av kvantitet.

.gitignore:
Denna fil används för att specificera vilka filer och mappar som ska ignoreras av Git.
/node_modules: Ignorerar mappen där alla npm-bibliotek installeras, vilket kan vara mycket stort och inte behövs i versionskontrollen.

products.json:
Denna fil innehåller en lista över produkter som säljs i webbshoppen. Varje produkt representeras som ett objekt med följande egenskaper:

id: Ett unikt identifierare för produkten.
name: Namnet på produkten.
price: Priset på produkten i SEK.
quantity: Antalet tillgängliga enheter i lager.
image: URL
till produktens bild.