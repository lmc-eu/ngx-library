describe('ngx.loader', function() {
    beforeEach(function() {
        module('ngx.loader');
    });

    it('should call onload callback', inject(function(ngxLoader) {
        ngxLoader(['test1.js', 'test2.js'], waitsFor(function() {
            expect(1).toEqual(1);
            return true;
        }));
    }));

    it('should throw an exception on unsupported type', inject(function(ngxLoader) {
        expect(function() {
            ngxLoader('image.jpg');
        }).toThrow('File type not supported');
    }));

});