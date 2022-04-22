
export const CommonJobs = {

  formatDate: (date: Date) => {
    let d     = new Date(date);
    let month = (d.getMonth() + 1).toString().padStart(2, '0');
    let day   = d.getDate().toString().padStart(2, '0');
    let year  = d.getFullYear();
    return [month, day, year].join('/');
  }

}
