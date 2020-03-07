"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var env_1 = require("~/app/env");
var DataService = /** @class */ (function () {
    function DataService(httpClient) {
        this.httpClient = httpClient;
        this.items = [];
    }
    DataService.prototype.reloadData = function () {
        var _this = this;
        this.httpClient.get(env_1.nightScoutPath + "treatments.json").subscribe(function (items) {
            _this.items = items;
            _this.items.forEach(function (item) { return (item.id = item._id); });
        });
    };
    DataService.prototype.getItem = function (id) {
        return this.items.filter(function (item) { return item.id === id; })[0];
    };
    DataService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        }),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], DataService);
    return DataService;
}());
exports.DataService = DataService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGF0YS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBQWtEO0FBQ2xELHNDQUEyQztBQUMzQyxpQ0FBMkM7QUFjM0M7SUFDRSxxQkFBb0IsVUFBc0I7UUFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUUxQyxVQUFLLEdBQUcsRUFBRSxDQUFDO0lBRmtDLENBQUM7SUFJOUMsZ0NBQVUsR0FBVjtRQUFBLGlCQUtDO1FBSkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsb0JBQWMsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFBLEtBQUs7WUFDckUsS0FBSSxDQUFDLEtBQUssR0FBRyxLQUFZLENBQUM7WUFDMUIsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFwQixDQUFvQixDQUFDLENBQUM7UUFDbkQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsNkJBQU8sR0FBUCxVQUFRLEVBQVU7UUFDaEIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFkLENBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFkVSxXQUFXO1FBSHZCLGlCQUFVLENBQUM7WUFDVixVQUFVLEVBQUUsTUFBTTtTQUNuQixDQUFDO3lDQUVnQyxpQkFBVTtPQUQvQixXQUFXLENBZXZCO0lBQUQsa0JBQUM7Q0FBQSxBQWZELElBZUM7QUFmWSxrQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uL2h0dHBcIjtcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IG5pZ2h0U2NvdXRQYXRoIH0gZnJvbSBcIn4vYXBwL2VudlwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJRGF0YUl0ZW0ge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgY3JlYXRlZF9hdDogc3RyaW5nO1xyXG4gIGNhcmJzOiBudW1iZXI7XHJcbiAgaW5zdWxpbjogbnVtYmVyO1xyXG4gIGVudGVyZWRCeTogc3RyaW5nO1xyXG4gIHJlYXNvbjogc3RyaW5nO1xyXG59XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogXCJyb290XCJcclxufSlcclxuZXhwb3J0IGNsYXNzIERhdGFTZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHBDbGllbnQ6IEh0dHBDbGllbnQpIHt9XHJcblxyXG4gIGl0ZW1zID0gW107XHJcblxyXG4gIHJlbG9hZERhdGEoKSB7XHJcbiAgICB0aGlzLmh0dHBDbGllbnQuZ2V0KG5pZ2h0U2NvdXRQYXRoICsgXCJ0cmVhdG1lbnRzLmpzb25cIikuc3Vic2NyaWJlKGl0ZW1zID0+IHtcclxuICAgICAgdGhpcy5pdGVtcyA9IGl0ZW1zIGFzIGFueTtcclxuICAgICAgdGhpcy5pdGVtcy5mb3JFYWNoKGl0ZW0gPT4gKGl0ZW0uaWQgPSBpdGVtLl9pZCkpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRJdGVtKGlkOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiB0aGlzLml0ZW1zLmZpbHRlcihpdGVtID0+IGl0ZW0uaWQgPT09IGlkKVswXTtcclxuICB9XHJcbn1cclxuIl19