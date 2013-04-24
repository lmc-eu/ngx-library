describe('ngx.date', function() {
    beforeEach(module('ngx.date', 'ngx.config'));

    it('should format datetime', inject(function(ngxDate) {
        var d = Math.floor(new Date(2012,9,28).getTime() / 1000);
        expect(ngxDate.format('Y-m-d', d)).toEqual('2012-10-28');
        var t = Math.floor(new Date(2012,8,28,8,50,30).getTime() / 1000);
        expect(ngxDate.format('j.n.Y H:i:s T', t)).toEqual('28.9.2012 08:50:30 UTC');
    }));

    it('should check datetime', inject(function(ngxDate) {
        expect(ngxDate.check(2012, 12, 21)).toBeTruthy();
        expect(ngxDate.check(2000, 1, 1)).toBeTruthy();
        expect(ngxDate.check(2010, 13, 10)).toBeFalsy();
        expect(ngxDate.check(1980, 2, 31)).toBeFalsy();
    }));
});