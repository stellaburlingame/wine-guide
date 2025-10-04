import regions from "../../components/Regions/regions.json";

const bodyScale = {
    "light": 0,
    "light to medium": 0.25,
    "medium": 0.5,
    "medium to full": 0.75,
    "full": 1
};
const searchFields = [
    'Summary',
    'Flavor',
    'Aroma',
    'Finish',
    'Acidity',
    'Body',
    'Body Characteristics',
    'Tannins',
    'Tannin Characteristics',
    'Stella Recommended',
    'Vinification',
    'Maturation',
    'Region',
    'Vineyard',
    'Wine Name',
    'Vintage',
    'Sweetness'
];
const DEFAULT_FILTERS = Object.freeze({
    searchQuery: '',
    selectedCountry: '',
    selectedRegion: '',
    priceType: '',
    selectedIcon: Object.freeze([]),
    boldness: 0,
    showBoldnessFilter: false,
    veganOnly: false,
    sustainableOnly: false,
    selectedType: '',
    varietalValue: 'all',
    priceRange: {
        bottle: {
            min: 0,
            max: 0
        },
        glass: {
            min: 0,
            max: 0
        }
    },
    minBottlePrice: null,
    maxBottlePrice: null,
    filtersReset: true,
});
    // filters = { ...DEFAULT_FILTERS, selectedIcon: [] };
    // originalWines = [];
    // wines = [];
    // constructor(wines) {
        // this.originalWines = wines;
        // this.wines = wines;
    // }
    export function searchQuery(query) {
        if (!query) return this.wines;
        this.filters.searchQuery = query.toLowerCase();
        this.applyFilters(this.filters);
        return this.wines;
    }
    export function filterByCountry(country) {
        if (!country) return this.wines;
        this.wines = this.wines.filter(wine => wine.Country === country);
        return this.wines;
    }
    export function filterByRegion(region) {
        if (!region) return this.wines;
        this.wines = this.wines.filter(wine => wine.Region === region);
        return this.wines;
    }
    export function filterByPriceType(priceType) {
        this.filters.priceType = priceType;
        return this.applyFilters(this.filters);
    }
    export function filterByIcons(icons) {
        if (!icons || icons.length === 0) return this.wines;
        this.wines = this.wines.filter(wine => {
            return icons.every(icon => wine[icon] === 'Yes');
        });
        return this.wines;
    }
    export function filterByBoldness(boldness, showBoldnessFilter) {
        if (!showBoldnessFilter) return this.wines;
        this.wines = this.wines.filter(wine => {
            const wineBodyValue = bodyScale[wine.Body.toLowerCase()] || 0;
            return wineBodyValue <= boldness;
        });
        return this.wines;
    }
    export function filterByVegan(veganOnly) {
        if (!veganOnly) return this.wines;
        this.wines = this.wines.filter(wine => wine.Vegan === 'Yes');
        return this.wines;
    }
    export function filterBySustainable(sustainableOnly) {
        if (!sustainableOnly) return this.wines;
        this.wines = this.wines.filter(wine => wine.Sustainable === 'Yes');
        return this.wines;
    }
    export function filterByType(type) {
        if (!type) return this.wines;
        this.wines = this.wines.filter(wine => wine['Wine Type'] === type);
        return this.wines;
    }
    export function filterByVarietal(varietal) {
        if (!varietal || varietal === 'all') return this.wines;
        this.wines = this.wines.filter(wine => wine.Varietal === varietal);
        return this.wines;
    }
    // export function filterByPriceRange(minPrice, maxPrice) {
    //     if (minPrice == null && maxPrice == null) return this.wines;
    //     this.filters.minBottlePrice = minPrice;
    //     this.filters.maxBottlePrice = maxPrice;
    //     this.filters.priceRange.bottle.min = minPrice;
    //     this.filters.priceRange.bottle.max = maxPrice;
    //     this.wines = this.wines.filter(wine => {
    //         // Support both naming conventions in data
    //         const price = parseFloat(wine['Bottle Price'] ?? wine.Bottle_Price);
    //         if (isNaN(price)) return false;
    //         if (this.filters.minBottlePrice != null && price < this.filters.minBottlePrice) return false;
    //         if (this.filters.maxBottlePrice != null && price > this.filters.maxBottlePrice) return false;
    //         return true;
    //     });
    //     return this.wines;
    // }
    export function applyFilters(filters, originalWines) {
        const filteredSpecs = originalWines.filter((wine) => {
            // Use regions mapping to get country for wine.Region
            const wineCountry = regions[wine.Region]?.Country || wine.Country;
            const matchCountry = filters.selectedCountry ? wineCountry === filters.selectedCountry : true;
            const matchRegion = filters.selectedRegion ? wine.Region === filters.selectedRegion : true;
            return matchCountry && matchRegion;
        });
        let filtered = filteredSpecs.filter(w => {
            // Country/region logic
            const wineCountry = regions[w.Region]?.Country || w.Country;
            const matchCountry = filters.selectedCountry ? wineCountry === filters.selectedCountry : true;
            const matchRegion = filters.selectedRegion ? w.Region === filters.selectedRegion : true;
            const varietalMatch = filters.varietalValue === "all" || w.Varietal === filters.varietalValue;
            const iconMatch = !filters.selectedIcon || filters.selectedIcon.length === 0 ||
            (w['Top Icons'] && filters.selectedIcon.every(icon => w['Top Icons'].includes(icon)));
            let typeMatch = true;
            if (filters.selectedType === "all" || filters.selectedType === "") {
                typeMatch = true;
            }
            else {
                const cats = (w.Categories || []).map(c => c.toLowerCase());
                const sel = filters.selectedType.toLowerCase();
                typeMatch = cats.includes(sel);
            }
            const searchMatch = !filters.searchQuery ||
            searchFields.some(field =>
                w[field]?.toString().toLowerCase().includes(filters.searchQuery)
            );
            const priceMatch = filters.priceType === "glass"
            ? parseFloat(w.Glass_Price) > 0 && (!w.Bottle_Price || parseFloat(w.Bottle_Price) === 0)
            : filters.priceType === "bottle"
                ? parseFloat(w.Bottle_Price) > 0 && (!w.Glass_Price || parseFloat(w.Glass_Price) === 0)
                : true;
            const wineBodyValue = bodyScale[w.Body?.toLowerCase()] ?? 0;
            const boldnessMatch = !filters.showBoldnessFilter || wineBodyValue === filters.boldness;
            return matchCountry && matchRegion && varietalMatch && iconMatch && typeMatch && searchMatch && priceMatch && boldnessMatch;
        });
        if (filters.veganOnly) {
            filtered = filtered.filter(wine => wine.Vegan === true);
        }
        if (filters.sustainableOnly) {
            filtered = filtered.filter(wine => wine.Sustainability && wine.Sustainability.length > 0);
        }
        // Sort only when viewing the glass category
        if (filters.selectedType === 'glass') {
            filtered.sort((a, b) => {
                const posA = Number(a["Glass Position"]) || 0;
                const posB = Number(b["Glass Position"]) || 0;
                if (posA !== posB) return posA - posB;
                // optional stable tie-breaker:
                return (a["Wine Name"] || "").localeCompare(b["Wine Name"] || "");
            });
        }
        return filtered;
    }
    export function isFiltersReset(filters) {
        return filters.filtersReset;
    }
    export function resetFilters(originalWines) {
        var filters = { ...DEFAULT_FILTERS, selectedIcon: [] };
        return { filters, wines: originalWines || [] };
    }