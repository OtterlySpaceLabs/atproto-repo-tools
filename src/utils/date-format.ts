import dayjs from "dayjs"
import localizedFormat from "dayjs/plugin/localizedFormat"
import relativeTime from "dayjs/plugin/relativeTime"
import updateLocale from "dayjs/plugin/updateLocale"
import "dayjs/locale/fr"
import "dayjs/locale/en"

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(updateLocale)

const SUPPORTED_LOCALES = ["fr", "en"]
const FALLBACK_LOCALE = "en"

dayjs.updateLocale("fr", {
	relativeTime: {
		future: "dans %s",
		past: "il y a %s",
		s: "%ss",
		m: "%mmin",
		mm: "%mmin",
		h: "%dh",
		hh: "%dh",
		d: "%dj",
		dd: "%dj",
		M: "%dmo",
		MM: "%dmo",
		y: "%da",
		yy: "%da"
	}
})

dayjs.updateLocale("en", {
	relativeTime: {
		future: "in %s",
		past: "%s ago",
		s: "%ss",
		m: "%dm",
		mm: "%dm",
		h: "%dh",
		hh: "%dh",
		d: "%dd",
		dd: "%dd",
		M: "%dmo",
		MM: "%dmo",
		y: "%dy",
		yy: "%dy"
	}
})

export function formatStatusDate(date: string | Date, locale?: string) {
	const dayjsDate = dayjs(date)

	if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
		locale = FALLBACK_LOCALE
	}

	// if date is in the future, return the date
	if (dayjsDate.isAfter(dayjs())) {
		return dayjsDate.locale(locale).format("L LT")
	}

	// if date is older than a week, return the date in short format (day and month)
	if (dayjsDate.isBefore(dayjs().subtract(1, "week"))) {
		// if date is in current year, return date without year
		if (dayjsDate.isSame(dayjs(), "year")) {
			// return formattedDate.replace(` ${dayjsDate.year()}`, "").replace(",", "")
			return dayjsDate.locale(locale).format(locale === "fr" ? "D MMM" : "MMM D")
		}

		return dayjsDate.locale(locale).format("ll")
	}

	// else return relative time
	return dayjsDate.locale(locale).fromNow(true)
}
