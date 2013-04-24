describe('ngx.date', function() {
    beforeEach(module('ngx.date', 'ngx.config'));

    it('should format datetime', inject(function(ngxDate) {
        expect(ngxDate.format('Y-m-d', 1351375200)).toEqual('2012-10-28');
        expect(ngxDate.format('j.n.Y H:i:s T', 1348815030)).toEqual('28.9.2012 08:50:30 UTC');
    }));

    it('should check datetime', inject(function(ngxDate) {
        expect(ngxDate.check(2012, 12, 21)).toBeTruthy();
        expect(ngxDate.check(2000, 1, 1)).toBeTruthy();
        expect(ngxDate.check(2010, 13, 10)).toBeFalsy();
        expect(ngxDate.check(1980, 2, 31)).toBeFalsy();
    }));
});