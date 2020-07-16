moment().format();
const refreshData = document.querySelector(".refreshdata-tooltip");
const local = moment.utc(dataObj.updated).local().format();
const relative = moment(local).fromNow();
refreshData.setAttribute(`data-original-title`,`Information last updated ${relative} .Click 'Refresh Information' to refresh`);
