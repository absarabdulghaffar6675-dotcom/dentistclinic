import { OpeningHour } from '@/types/clinic';

export interface ScheduleStatus {
  isOpen: boolean;
  statusText: string;
  badgeClass: string;
  detailsText: string;
}

/**
 * Calculates whether Dynasty Dental Solutions is currently open
 * based on the saved schedule and the Asia/Karachi timezone.
 */
export function calculateClinicStatus(
  hours: OpeningHour[],
  timezone: string = 'Asia/Karachi',
  holidayNotice?: string,
  showHolidayNotice?: boolean
): ScheduleStatus {
  if (showHolidayNotice && holidayNotice) {
    return {
      isOpen: false,
      statusText: 'Temporary Notice',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      detailsText: holidayNotice,
    };
  }

  try {
    // Get current date & time in the target timezone
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });

    const parts = formatter.formatToParts(now);
    let weekday = '';
    let hour = 0;
    let minute = 0;

    for (const part of parts) {
      if (part.type === 'weekday') weekday = part.value;
      if (part.type === 'hour') hour = parseInt(part.value, 10);
      if (part.type === 'minute') minute = parseInt(part.value, 10);
    }

    const currentMinutes = hour * 60 + minute;
    const currentDayConfig = hours.find((h) => h.day_of_week === weekday);

    if (!currentDayConfig) {
      return {
        isOpen: true,
        statusText: 'Open now',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        detailsText: 'Open 24 hours',
      };
    }

    if (currentDayConfig.is_closed) {
      return {
        isOpen: false,
        statusText: 'Closed now',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        detailsText: `Closed today (${weekday})`,
      };
    }

    if (currentDayConfig.is_open_24h) {
      return {
        isOpen: true,
        statusText: 'Open now',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        detailsText: 'Open 24 hours',
      };
    }

    // Parse open and close times (e.g. "09:00", "22:00")
    const [openH, openM] = (currentDayConfig.open_time || '00:00').split(':').map(Number);
    const [closeH, closeM] = (currentDayConfig.close_time || '23:59').split(':').map(Number);

    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    // Normal daytime hours
    if (openMinutes <= closeMinutes) {
      if (currentMinutes >= openMinutes && currentMinutes <= closeMinutes) {
        return {
          isOpen: true,
          statusText: 'Open now',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          detailsText: `Closes at ${formatTimeDisplay(currentDayConfig.close_time)}`,
        };
      } else {
        return {
          isOpen: false,
          statusText: 'Closed now',
          badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
          detailsText: `Opens at ${formatTimeDisplay(currentDayConfig.open_time)}`,
        };
      }
    } else {
      // Overnight hours (e.g. 20:00 to 06:00 next day)
      if (currentMinutes >= openMinutes || currentMinutes <= closeMinutes) {
        return {
          isOpen: true,
          statusText: 'Open now',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          detailsText: `Overnight care until ${formatTimeDisplay(currentDayConfig.close_time)}`,
        };
      } else {
        return {
          isOpen: false,
          statusText: 'Closed now',
          badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
          detailsText: `Opens at ${formatTimeDisplay(currentDayConfig.open_time)}`,
        };
      }
    }
  } catch {
    return {
      isOpen: true,
      statusText: 'Open now',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      detailsText: 'Open 24 hours',
    };
  }
}

function formatTimeDisplay(time24: string): string {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const displayM = m < 10 ? `0${m}` : m;
  return `${displayH}:${displayM} ${period}`;
}
